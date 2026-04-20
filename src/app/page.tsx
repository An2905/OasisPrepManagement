import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50">
      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-zinc-600">Project OasisRecepManagement</p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Quản lý nhân viên &amp; checkout phòng (Demo UI)
            </h1>
            <p className="max-w-2xl text-zinc-600">
              Đây là bản UX/UI chạy bằng dữ liệu mock để bạn duyệt luồng. Backend + database + phân
              quyền thật sẽ nối ở bước sau.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
              href="/login"
            >
              <div className="text-sm font-medium text-zinc-900">Login</div>
              <div className="mt-1 text-sm text-zinc-600">Đăng nhập, chọn role demo</div>
              <div className="mt-4 text-sm font-medium text-zinc-900 group-hover:underline">
                Mở trang →
              </div>
            </Link>

            <Link
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
              href="/admin/dashboard"
            >
              <div className="text-sm font-medium text-zinc-900">Admin</div>
              <div className="mt-1 text-sm text-zinc-600">Rooms, Room Class + checklist, nhân viên, KPI</div>
              <div className="mt-4 text-sm font-medium text-zinc-900 group-hover:underline">
                Mở trang →
              </div>
            </Link>

            <Link
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
              href="/staff/rooms"
            >
              <div className="text-sm font-medium text-zinc-900">Nhân viên</div>
              <div className="mt-1 text-sm text-zinc-600">Nhận phòng checkout, checklist, ghi chú, ký tên</div>
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
