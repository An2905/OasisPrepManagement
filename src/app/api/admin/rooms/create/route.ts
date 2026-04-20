import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { roomId: string; location: string; roomClassId: string };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const roomId = body?.roomId?.trim() ?? "";
  const location = body?.location?.trim() ?? "";
  const roomClassId = body?.roomClassId?.trim() ?? "";

  if (!roomId || !location || !roomClassId) {
    return NextResponse.json({ ok: false, error: "Thiếu dữ liệu." }, { status: 400 });
  }

  const room = await prisma.room.create({
    data: { roomId, location, roomClassId, status: "Ready" },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: room.id });
}

