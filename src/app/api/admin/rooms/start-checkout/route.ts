import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { roomId: string };

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const roomId = body?.roomId?.trim() ?? "";
  if (!roomId) return NextResponse.json({ ok: false, error: "Thiếu roomId." }, { status: 400 });

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
  if (room.status === "CheckOutProcessing") {
    return NextResponse.json({ ok: false, error: "Phòng đang checkout." }, { status: 400 });
  }
  if (room.tasks.length > 0) {
    return NextResponse.json({ ok: false, error: "Phòng đã có task đang xử lý." }, { status: 400 });
  }

  // Pick least-loaded active staff (fewest open tasks).
  const staff = await prisma.user.findMany({
    where: { role: "STAFF", active: true },
    select: {
      id: true,
      displayName: true,
      _count: {
        select: {
          assignedTasks: { where: { status: { in: ["Assigned", "InProgress"] } } },
        },
      },
    },
    orderBy: [
      { assignedTasks: { _count: "asc" } as never },
      { displayName: "asc" },
    ],
    take: 1,
  });

  const assignee = staff[0];
  if (!assignee) {
    return NextResponse.json({ ok: false, error: "Chưa có nhân viên active." }, { status: 400 });
  }

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
  });
}

