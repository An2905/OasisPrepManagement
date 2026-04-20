import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const employees = [
  { id: "nv01", name: "Nguyễn Văn An", username: "nv01", active: true, today: 5 },
  { id: "nv02", name: "Trần Thị Bình", username: "nv02", active: true, today: 6 },
  { id: "nv03", name: "Lê Quốc Cường", username: "nv03", active: true, today: 3 },
  { id: "nv04", name: "Phạm Gia Dung", username: "nv04", active: false, today: 0 },
];

export default function AdminEmployeesPage() {
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
                <th className="px-4 py-3">Checkout hôm nay</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {e.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{e.username}</td>
                  <td className="px-4 py-3">
                    {e.active ? (
                      <Badge variant="green">Active</Badge>
                    ) : (
                      <Badge variant="neutral">Inactive</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{e.today}</td>
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
      </CardBody>
    </Card>
  );
}

