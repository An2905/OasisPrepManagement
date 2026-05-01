import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { resolveStaffShiftForCheckout, STAFF_SHIFT_LABELS } from "@/lib/shift";

export const runtime = "nodejs";

type Body = { roomId: string; shift?: unknown };

function workloadPoints(user: {
  assignedTasks: { room: { points: number } }[];
  completedTasks: { room: { points: number } }[];
}) {
  let sum = 0;
  for (const t of user.assignedTasks) sum += t.room.points;
  for (const t of user.completedTasks) sum += t.room.points;
  return sum;
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const roomId = body?.roomId?.trim() ?? "";
  if (!roomId) return NextResponse.json({ ok: false, error: "Thiếu roomId." }, { status: 400 });

  const targetShift = resolveStaffShiftForCheckout(body?.shift);

  const room = await prisma.room.findUnique({
    where: { roomId },
    include: {
      tasks: {
        where: { status: { in: ["Assigned", "InProgress"] } },
        take: 1,
      },
    },
  });
  if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng." }, { status: 404 });
  if (room.status !== "CheckedIn") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Chỉ bắt đầu checkout khi phòng đang «Có khách». Luồng: Sẵn sàng → Có khách → Bắt đầu checkout.",
      },
      { status: 400 },
    );
  }
  if (room.tasks.length > 0) {
    return NextResponse.json({ ok: false, error: "Phòng đã có task đang xử lý." }, { status: 400 });
  }

  const candidates = await prisma.user.findMany({
    where: { role: "STAFF", active: true, shift: targetShift },
    select: {
      id: true,
      displayName: true,
      assignedTasks: {
        where: { status: { in: ["Assigned", "InProgress"] } },
        select: { room: { select: { points: true } } },
      },
      completedTasks: {
        where: { status: "Completed" },
        select: { room: { select: { points: true } } },
      },
    },
  });

  if (candidates.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: `Không có nhân viên active trong ${STAFF_SHIFT_LABELS[targetShift]}.`,
      },
      { status: 400 },
    );
  }

  candidates.sort((a, b) => {
    const da = workloadPoints(a);
    const db = workloadPoints(b);
    if (da !== db) return da - db;
    return a.displayName.localeCompare(b.displayName, "vi");
  });

  const assignee = candidates[0];

  const task = await prisma.$transaction(async (tx) => {
    await tx.room.update({
      where: { id: room.id },
      data: { status: "CheckOutProcessing" },
    });
    return tx.checkOutTask.create({
      data: {
        roomId: room.id,
        assignedToId: assignee.id,
        status: "Assigned",
        notes: "",
        signatureName: "",
      },
    });
  });

  return NextResponse.json({
    ok: true,
    taskId: task.id,
    assignedTo: assignee.displayName,
    shift: targetShift,
  });
}
