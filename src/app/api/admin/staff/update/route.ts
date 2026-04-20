import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { userId: string; username: string; displayName: string };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const userId = body?.userId?.trim() ?? "";
  const username = body?.username?.trim() ?? "";
  const displayName = body?.displayName?.trim() ?? "";

  if (!userId || !username || !displayName) {
    return NextResponse.json({ ok: false, error: "Thiếu dữ liệu." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { username, displayName },
  });

  return NextResponse.json({ ok: true });
}

