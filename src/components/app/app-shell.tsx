import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type React from "react";
import { LogoutButton } from "@/components/app/logout-button";
import { BuildStamp } from "@/components/app/build-stamp";

export type AppShellNavItem = {
  href: string;
  label: string;
};

export function AppShell({
  title,
  roleLabel,
  userName,
  nav,
  children,
}: {
  title: string;
  roleLabel: "Admin" | "Nhân viên";
  userName: string;
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
                <div className="mt-1 truncate text-xs text-zinc-600">
                  {userName}
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
              <LogoutButton className="w-full" />
              <div className="mt-3">
                <BuildStamp />
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium text-zinc-600">
                <span>OasisPrepManagement</span>
                <span className="px-2 text-zinc-400">/</span>
                <span className="text-zinc-900">{title}</span>
              </div>
              <div className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
                {title}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:hidden">
              <Badge variant="neutral">{roleLabel}</Badge>
              <LogoutButton />
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

