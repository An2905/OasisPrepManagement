import { NextResponse } from "next/server";
import type { StaffShift } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { isStaffShift } from "@/lib/shift";

export const runtime = "nodejs";

type Body = { userId: string; username: string; displayName: string; shift?: string };

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

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return NextResponse.json({ ok: false, error: "Không tìm thấy user." }, { status: 404 });

  if (existing.role === "STAFF") {
    const shiftRaw = body?.shift?.trim() ?? "";
    if (!isStaffShift(shiftRaw)) {
      return NextResponse.json({ ok: false, error: "Nhân viên cần ca hợp lệ." }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { username, displayName, shift: shiftRaw as StaffShift },
    });
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { username, displayName },
    });
  }

  return NextResponse.json({ ok: true });
}

