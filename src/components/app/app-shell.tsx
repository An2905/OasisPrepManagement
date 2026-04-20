import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type React from "react";

export type AppShellNavItem = {
  href: string;
  label: string;
};

export function AppShell({
  title,
  roleLabel,
  nav,
  children,
}: {
  title: string;
  roleLabel: "Admin" | "Nhân viên";
  nav: AppShellNavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-zinc-50">
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-64 shrink-0 sm:block">
          <div className="sticky top-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-900">
                  {title}
                </div>
                <div className="mt-1 text-xs text-zinc-600">
                  OasisRecepManagement (UI demo)
                </div>
              </div>
              <Badge variant="neutral">{roleLabel}</Badge>
            </div>

            <nav className="mt-4 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 border-t border-zinc-200 pt-4">
              <div className="text-xs font-medium text-zinc-600">
                Chuyển nhanh
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <Link
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  href="/admin/dashboard"
                >
                  Admin
                </Link>
                <Link
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  href="/staff/rooms"
                >
                  Nhân viên
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xl font-semibold tracking-tight text-zinc-900">
                {title}
              </div>
              <div className="mt-1 text-sm text-zinc-600">
                Giao diện demo (chưa nối đăng nhập thật).
              </div>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

