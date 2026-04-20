import { AppShell } from "@/components/app/app-shell";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/staff/rooms");
  if (user.role !== "STAFF") redirect("/admin/dashboard");

  return (
    <AppShell
      title="Nhân viên"
      roleLabel="Nhân viên"
      nav={[
        { href: "/staff/rooms", label: "Danh sách phòng" },
        { href: "/staff/my-tasks", label: "Task của tôi" },
        { href: "/staff/history", label: "Lịch sử" },
      ]}
    >
      {children}
    </AppShell>
  );
}

