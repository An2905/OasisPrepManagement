import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50">
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-zinc-600">
              OasisPrepManagement
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Quản lý checkout phòng &amp; hiệu suất nhân viên
            </h1>
            <p className="max-w-2xl text-zinc-600">
              Đăng nhập để vào phân luồng Admin hoặc Nhân viên.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
              href="/login"
            >
              <div className="text-sm font-medium text-zinc-900">Login</div>
              <div className="mt-1 text-sm text-zinc-600">Đăng nhập hệ thống</div>
              <div className="mt-4 text-sm font-medium text-zinc-900 group-hover:underline">
                Mở trang →
              </div>
            </Link>

            <Link
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
              href="/admin/dashboard"
            >
              <div className="text-sm font-medium text-zinc-900">Admin</div>
              <div className="mt-1 text-sm text-zinc-600">
                CRUD phòng, hạng phòng, nhân viên, KPI
              </div>
              <div className="mt-4 text-sm font-medium text-zinc-900 group-hover:underline">
                Mở trang →
              </div>
            </Link>

            <Link
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
              href="/staff/rooms"
            >
              <div className="text-sm font-medium text-zinc-900">Nhân viên</div>
              <div className="mt-1 text-sm text-zinc-600">
                Checklist, ghi chú, ký xác nhận checkout
              </div>
              <div className="mt-4 text-sm font-medium text-zinc-900 group-hover:underline">
                Mở trang →
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
