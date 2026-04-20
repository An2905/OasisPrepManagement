import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { userId: string; password: string };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const userId = body?.userId?.trim() ?? "";
  const password = body?.password ?? "";
  if (!userId || password.length < 4) {
    return NextResponse.json(
      { ok: false, error: "Thiếu userId hoặc mật khẩu quá ngắn (>=4 ký tự)." },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}

