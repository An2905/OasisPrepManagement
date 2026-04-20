"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") || "", [searchParams]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; user: { role: "ADMIN" | "STAFF" } }
        | { ok: false; error?: string }
        | null;

      if (!res.ok || !data || data.ok !== true) {
        setError(
          data && "error" in data
            ? data.error ?? "Đăng nhập thất bại."
            : "Đăng nhập thất bại.",
        );
        return;
      }

      if (nextPath) {
        router.push(nextPath);
        return;
      }

      router.push(data.user.role === "ADMIN" ? "/admin/dashboard" : "/staff/rooms");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <main className="mx-auto flex w-full max-w-lg flex-col px-6 py-12">
        <div className="mb-6">
          <div className="text-sm font-medium text-zinc-600">
            Project OasisRecepManagement
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            Đăng nhập
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Đăng nhập để vào đúng phân luồng Admin / Nhân viên.
          </p>
        </div>

        <Card>
          <CardHeader
            title="Tài khoản"
            subtitle="Seed để test nhanh: admin/admin123 • nv01/nv123"
          />
          <CardBody>
            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs font-medium text-zinc-700">
                  Tên đăng nhập
                </span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="vd: admin hoặc nv01"
                  autoComplete="username"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-xs font-medium text-zinc-700">
                  Mật khẩu
                </span>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void onSubmit();
                  }}
                />
              </label>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="mt-1 grid gap-2 sm:grid-cols-2">
                <Button className="w-full" onClick={onSubmit} disabled={loading}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
                <Link href="/">
                  <Button className="w-full" variant="secondary" disabled={loading}>
                    Quay lại
                  </Button>
                </Link>
              </div>

              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    setUsername("admin");
                    setPassword("admin123");
                  }}
                  disabled={loading}
                >
                  Điền nhanh Admin
                </Button>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    setUsername("nv01");
                    setPassword("nv123");
                  }}
                  disabled={loading}
                >
                  Điền nhanh Nhân viên
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="mt-6 text-sm text-zinc-600">
          Quay lại{" "}
          <Link className="font-medium text-zinc-900 hover:underline" href="/">
            trang chủ
          </Link>
          .
        </div>
      </main>
    </div>
  );
}

