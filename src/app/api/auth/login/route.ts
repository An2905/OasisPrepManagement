import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { newSessionToken } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/auth-constants";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.active) {
    return NextResponse.json({ ok: false, error: "Sai username hoặc mật khẩu." }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Sai username hoặc mật khẩu." }, { status: 401 });
  }

  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12); // 12 hours
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  const res = NextResponse.json({
    ok: true,
    user: {
      role: user.role,
      username: user.username,
      displayName: user.displayName,
    },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return res;
}

