import type { RoomStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { isManualRoomStatus } from "@/lib/room-status";

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

  let nextStatus: RoomStatus | undefined;
  if (statusRaw !== undefined && statusRaw !== null && statusRaw !== "") {
    if (!isManualRoomStatus(String(statusRaw))) {
      return NextResponse.json(
        { ok: false, error: "Chỉ đổi được Sẵn sàng / Có khách từ đây; checkout dùng nút riêng." },
        { status: 400 },
      );
    }
    nextStatus = statusRaw as RoomStatus;
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

  const hasActiveCheckout = room.tasks.length > 0;
  if (hasActiveCheckout && nextStatus !== undefined) {
    return NextResponse.json(
      {
        ok: false,
        error: "Đang có task checkout — hoàn tất checklist trước khi đổi trạng thái.",
      },
      { status: 400 },
    );
  }

  await prisma.room.update({
    where: { id },
    data: {
      location,
      roomClassId,
      ...(points !== null ? { points } : {}),
      ...(nextStatus !== undefined ? { status: nextStatus } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

