import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = {
  roomId: string;
  items: Array<{ label: string; ok: boolean }>;
  notes?: string;
};

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (user.role !== "STAFF") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const roomId = body?.roomId?.trim() ?? "";
  const notes = body?.notes?.trim() ?? "";
  const items = body?.items ?? [];

  if (!roomId) return NextResponse.json({ ok: false, error: "Thiếu roomId." }, { status: 400 });
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ ok: false, error: "Thiếu checklist." }, { status: 400 });
  }

  const room = await prisma.room.findUnique({
    where: { roomId },
    include: {
      tasks: {
        where: { status: { in: ["Assigned", "InProgress"] } },
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  });
  if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng." }, { status: 404 });

  const task = room.tasks[0];
  if (!task) return NextResponse.json({ ok: false, error: "Phòng chưa có task." }, { status: 400 });
  if (task.assignedToId !== user.id) {
    return NextResponse.json({ ok: false, error: "Task không thuộc về bạn." }, { status: 403 });
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.checkOutTask.update({
      where: { id: task.id },
      data: {
        status: "Completed",
        startedAt: task.startedAt ?? now,
        completedAt: now,
        notes,
        signatureName: user.displayName,
        completedById: user.id,
      },
    });

    for (const it of items) {
      if (!it?.label) continue;
      await tx.checkOutChecklistResult.upsert({
        where: { taskId_label: { taskId: task.id, label: it.label } },
        update: { ok: !!it.ok },
        create: { taskId: task.id, label: it.label, ok: !!it.ok },
      });
    }

    await tx.room.update({
      where: { id: room.id },
      data: { status: "Ready" },
    });
  });

  return NextResponse.json({ ok: true });
}

