import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { id: string };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const id = body?.id?.trim() ?? "";
  if (!id) return NextResponse.json({ ok: false, error: "Thiếu id." }, { status: 400 });

  const rooms = await prisma.room.count({ where: { roomClassId: id } });
  if (rooms > 0) {
    return NextResponse.json(
      { ok: false, error: "Không thể xoá: hạng phòng còn phòng." },
      { status: 400 },
    );
  }

  await prisma.roomClass.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

