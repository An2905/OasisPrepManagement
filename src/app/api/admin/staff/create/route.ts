import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { username: string; displayName: string; password: string };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const username = body?.username?.trim() ?? "";
  const displayName = body?.displayName?.trim() ?? "";
  const password = body?.password ?? "";
  const role = (body as { role?: string } | null)?.role === "ADMIN" ? "ADMIN" : "STAFF";

  if (!username || !displayName || password.length < 4) {
    return NextResponse.json(
      { ok: false, error: "Thiếu dữ liệu hoặc mật khẩu quá ngắn (>=4 ký tự)." },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      displayName,
      passwordHash,
      role,
      active: true,
    },
    select: { id: true, username: true, displayName: true },
  });

  return NextResponse.json({ ok: true, user });
}

