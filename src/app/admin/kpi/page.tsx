import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const kpiTargets = [
  { className: "Deluxe", targetMinutes: 15 },
  { className: "Premium", targetMinutes: 20 },
  { className: "Villa", targetMinutes: 28 },
];

const staffStats = [
  { name: "Nguyễn Văn An", weekAvg: 16.1, monthAvg: 17.9, issues: 1 },
  { name: "Trần Thị Bình", weekAvg: 15.4, monthAvg: 16.8, issues: 0 },
  { name: "Lê Quốc Cường", weekAvg: 19.7, monthAvg: 18.6, issues: 2 },
];

export default function AdminKpiPage() {
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
                  <tr key={k.className} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {k.className}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      ≤ {k.targetMinutes} phút
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Thống kê theo nhân viên"
          subtitle="Tuần / tháng: thời gian checkout trung bình và số phòng có issue."
        />
        <CardBody>
          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-medium text-zinc-600">
                <tr>
                  <th className="px-4 py-3">Nhân viên</th>
                  <th className="px-4 py-3">TB tuần (phút)</th>
                  <th className="px-4 py-3">TB tháng (phút)</th>
                  <th className="px-4 py-3">Issue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {staffStats.map((s) => (
                  <tr key={s.name} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{s.weekAvg}</td>
                    <td className="px-4 py-3 text-zinc-700">{s.monthAvg}</td>
                    <td className="px-4 py-3">
                      {s.issues === 0 ? (
                        <Badge variant="green">0</Badge>
                      ) : (
                        <Badge variant="amber">{s.issues}</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

