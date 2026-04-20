import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminKpiPage() {
  const kpiTargets = await prisma.kpiTarget.findMany({
    include: { roomClass: true },
    orderBy: { roomClass: { name: "asc" } },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader
          title="KPI mục tiêu"
          subtitle="Thiết lập KPI theo hạng phòng (phút)."
          right={<Button>+ Thêm / sửa KPI</Button>}
        />
        <CardBody>
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-medium text-zinc-600">
                <tr>
                  <th className="px-4 py-3">Hạng phòng</th>
                  <th className="px-4 py-3">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {kpiTargets.map((k) => (
                  <tr key={k.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {k.roomClass.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      ≤ {k.targetMinutes} phút
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {kpiTargets.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              Chưa có KPI.
            </div>
          ) : null}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Thống kê theo nhân viên"
          subtitle="Tuần / tháng: thời gian checkout trung bình và số phòng có issue."
        />
        <CardBody>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            (Sắp nối) Thống kê tuần/tháng sẽ tính theo `CheckOutTask.completedAt - startedAt`.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

