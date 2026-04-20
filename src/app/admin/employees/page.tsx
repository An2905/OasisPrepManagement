import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  CreateStaffInline,
  DeleteUserButton,
  EditStaffInline,
  ResetPasswordInline,
  ToggleActiveButton,
} from "@/app/admin/employees/employee-actions";

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
  const employees = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { active: "desc" }, { displayName: "asc" }],
  });

  return (
    <Card>
      <CardHeader
        title="Người dùng"
        subtitle="Admin tạo tài khoản STAFF/ADMIN, bật/tắt hoạt động, reset mật khẩu và xoá tài khoản."
      />
      <CardBody>
        <div className="mb-5 rounded-2xl border border-zinc-200 bg-white p-4">
          <CreateStaffInline />
        </div>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium text-zinc-600">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {e.displayName}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{e.username}</td>
                  <td className="px-4 py-3">
                    <Badge variant={e.role === "ADMIN" ? "blue" : "neutral"}>
                      {e.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {e.active ? (
                      <Badge variant="green">Active</Badge>
                    ) : (
                      <Badge variant="neutral">Inactive</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <ToggleActiveButton userId={e.id} active={e.active} />
                      <EditStaffInline
                        userId={e.id}
                        username={e.username}
                        displayName={e.displayName}
                      />
                      <ResetPasswordInline userId={e.id} />
                      <DeleteUserButton userId={e.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {employees.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            Chưa có user.
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

