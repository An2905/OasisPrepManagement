import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  return NextResponse.json({
    ok: true,
    user: { role: user.role, username: user.username, displayName: user.displayName },
  });
}

