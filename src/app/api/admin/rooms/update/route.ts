import type { RoomStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { validateAdminRoomStatusTransition } from "@/lib/room-status";

export const runtime = "nodejs";

type Body = {
  id: string;
  location: string;
  roomClassId: string;
  points?: number;
  status?: string;
};

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const id = body?.id?.trim() ?? "";
  const location = body?.location?.trim() ?? "";
  const roomClassId = body?.roomClassId?.trim() ?? "";
  const points =
    typeof body?.points === "number" && Number.isFinite(body.points) ? Math.floor(body.points) : null;
  const statusRaw = body?.status;

  if (!id || !location || !roomClassId) {
    return NextResponse.json({ ok: false, error: "Thiếu dữ liệu." }, { status: 400 });
  }
  if (points !== null && points < 0) {
    return NextResponse.json({ ok: false, error: "Điểm phòng >= 0." }, { status: 400 });
  }

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      tasks: {
        where: { status: { in: ["Assigned", "InProgress"] } },
        take: 1,
      },
    },
  });
  if (!room) return NextResponse.json({ ok: false, error: "Không tìm thấy phòng." }, { status: 404 });

  let statusToApply: RoomStatus | undefined;
  if (statusRaw !== undefined && statusRaw !== null && `${statusRaw}`.trim() !== "") {
    const parsed = validateAdminRoomStatusTransition(room.status, String(statusRaw));
    if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.message }, { status: 400 });
    if (parsed.next !== null) statusToApply = parsed.next;
  }

  const hasActiveCheckout = room.tasks.length > 0;
  const leavingCheckout =
    hasActiveCheckout &&
    statusToApply !== undefined &&
    statusToApply !== "CheckOutProcessing";

  await prisma.$transaction(async (tx) => {
    if (leavingCheckout) {
      await tx.checkOutTask.updateMany({
        where: {
          roomId: room.id,
          status: { in: ["Assigned", "InProgress"] },
        },
        data: { status: "Cancelled" },
      });
    }

    await tx.room.update({
      where: { id },
      data: {
        location,
        roomClassId,
        ...(points !== null ? { points } : {}),
        ...(statusToApply !== undefined ? { status: statusToApply } : {}),
      },
    });
  });

  return NextResponse.json({ ok: true });
}
