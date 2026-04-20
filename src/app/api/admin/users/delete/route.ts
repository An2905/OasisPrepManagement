import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { userId: string };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const userId = body?.userId?.trim() ?? "";
  if (!userId) return NextResponse.json({ ok: false, error: "Thiếu userId." }, { status: 400 });

  if (userId === admin.id) {
    return NextResponse.json({ ok: false, error: "Không thể xoá chính bạn." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ ok: false, error: "Không tìm thấy user." }, { status: 404 });

  if (target.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN", active: true } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { ok: false, error: "Không thể xoá admin cuối cùng." },
        { status: 400 },
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    // remove sessions first (token FK)
    await tx.session.deleteMany({ where: { userId } });
    await tx.user.delete({ where: { id: userId } });
  });

  return NextResponse.json({ ok: true });
}

