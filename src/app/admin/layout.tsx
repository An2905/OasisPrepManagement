import { AppShell } from "@/components/app/app-shell";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin/dashboard");
  if (user.role !== "ADMIN") redirect("/staff/rooms");

  return (
    <AppShell
      title="Admin"
      roleLabel="Admin"
      nav={[
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/room-classes", label: "Hạng phòng & checklist" },
        { href: "/admin/rooms", label: "Phòng" },
        { href: "/admin/employees", label: "Nhân viên" },
        { href: "/admin/kpi", label: "KPI & thống kê" },
      ]}
    >
      {children}
    </AppShell>
  );
}

