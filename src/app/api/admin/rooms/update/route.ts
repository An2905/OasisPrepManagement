import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { id: string; location: string; roomClassId: string; points?: number };

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

  if (!id || !location || !roomClassId) {
    return NextResponse.json({ ok: false, error: "Thiếu dữ liệu." }, { status: 400 });
  }
  if (points !== null && points < 0) {
    return NextResponse.json({ ok: false, error: "Điểm phòng >= 0." }, { status: 400 });
  }

  await prisma.room.update({
    where: { id },
    data: {
      location,
      roomClassId,
      ...(points !== null ? { points } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

