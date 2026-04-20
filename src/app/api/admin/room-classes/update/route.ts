import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { id: string; name: string; location: string; checklist: string[] };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const id = body?.id?.trim() ?? "";
  const name = body?.name?.trim() ?? "";
  const location = body?.location?.trim() ?? "";
  const checklist = Array.isArray(body?.checklist)
    ? body!.checklist.map((x) => (x ?? "").trim()).filter(Boolean)
    : [];

  if (!id || !name || !location || checklist.length === 0) {
    return NextResponse.json({ ok: false, error: "Thiếu dữ liệu." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.roomClass.update({ where: { id }, data: { name, location } });
    await tx.roomClassChecklistItem.deleteMany({ where: { roomClassId: id } });
    await tx.roomClassChecklistItem.createMany({
      data: checklist.map((label, i) => ({ roomClassId: id, label, sortOrder: i })),
      skipDuplicates: true,
    });
  });

  return NextResponse.json({ ok: true });
}

