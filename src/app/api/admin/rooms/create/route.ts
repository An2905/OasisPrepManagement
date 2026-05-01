import type { RoomStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { isManualRoomStatus } from "@/lib/room-status";

export const runtime = "nodejs";

type Body = { roomId: string; location: string; roomClassId: string; points?: number; status?: string };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const roomId = body?.roomId?.trim() ?? "";
  const location = body?.location?.trim() ?? "";
  const roomClassId = body?.roomClassId?.trim() ?? "";
  const points = typeof body?.points === "number" && Number.isFinite(body.points) ? Math.floor(body.points) : 1;
  const statusRaw = body?.status;

  if (!roomId || !location || !roomClassId) {
    return NextResponse.json({ ok: false, error: "Thiếu dữ liệu." }, { status: 400 });
  }
  if (points < 0) {
    return NextResponse.json({ ok: false, error: "Điểm phòng >= 0." }, { status: 400 });
  }

  let status: RoomStatus = "Ready";
  if (statusRaw !== undefined && statusRaw !== null && statusRaw !== "") {
    if (!isManualRoomStatus(String(statusRaw))) {
      return NextResponse.json({ ok: false, error: "Trạng thái chỉ được Sẵn sàng hoặc Có khách." }, { status: 400 });
    }
    status = statusRaw as RoomStatus;
  }

  const room = await prisma.room.create({
    data: { roomId, location, roomClassId, points, status },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: room.id });
}

