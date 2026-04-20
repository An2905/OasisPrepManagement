import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth-constants";

export function newSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? "";
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) return null;
  if (!session.user.active) return null;

  return session.user;
}

export function isRole(user: { role: UserRole } | null, role: UserRole) {
  return !!user && user.role === role;
}

