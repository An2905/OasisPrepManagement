import { Suspense } from "react";
import { LoginClient } from "@/app/login/login-client";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full bg-zinc-50">
          <main className="mx-auto w-full max-w-lg px-6 py-12">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              Đang tải...
            </div>
          </main>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}

