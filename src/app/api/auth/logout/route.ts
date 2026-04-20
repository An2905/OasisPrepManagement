import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth-constants";

export async function POST() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? "";
  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => null);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

