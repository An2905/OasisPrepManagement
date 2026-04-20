import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
  const employees = await prisma.user.findMany({
    where: { role: "STAFF" },
    orderBy: [{ active: "desc" }, { displayName: "asc" }],
  });

  return (
    <Card>
      <CardHeader
        title="Nhân viên"
        subtitle="Admin tạo tài khoản nhân viên (username/password), bật/tắt hoạt động."
        right={<Button>+ Tạo tài khoản</Button>}
      />
      <CardBody>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium text-zinc-600">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Username</th>
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
                    {e.active ? (
                      <Badge variant="green">Active</Badge>
                    ) : (
                      <Badge variant="neutral">Inactive</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" size="sm">
                        Reset mật khẩu
                      </Button>
                      <Button variant="ghost" size="sm">
                        Sửa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {employees.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            Chưa có nhân viên.
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

