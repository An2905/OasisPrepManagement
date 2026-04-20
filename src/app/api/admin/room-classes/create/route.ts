import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { name: string; location: string; checklist: string[] };

export async function POST(req: Request) {
  const admin = await getSessionUser();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  if (admin.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const name = body?.name?.trim() ?? "";
  const location = body?.location?.trim() ?? "";
  const checklist = Array.isArray(body?.checklist)
    ? body!.checklist.map((x) => (x ?? "").trim()).filter(Boolean)
    : [];

  if (!name || !location) {
    return NextResponse.json({ ok: false, error: "Thiếu tên hoặc khu." }, { status: 400 });
  }

  const roomClass = await prisma.roomClass.create({
    data: {
      name,
      location,
      checklist: {
        create: checklist.map((label, i) => ({ label, sortOrder: i })),
      },
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: roomClass.id });
}

