import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function diffMinutes(start?: Date | null, end?: Date | null) {
  if (!start || !end) return null;
  return Math.max(0, (end.getTime() - start.getTime()) / 60000);
}

export default async function AdminDashboardPage() {
  const [roomsTotal, ready, checkedIn, processing, staffCount] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: "Ready" } }),
    prisma.room.count({ where: { status: "CheckedIn" } }),
    prisma.room.count({ where: { status: "CheckOutProcessing" } }),
    prisma.user.count({ where: { role: "STAFF", active: true } }),
  ]);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const recentCompleted = await prisma.checkOutTask.findMany({
    where: { status: "Completed", completedAt: { gte: weekStart } },
    select: { startedAt: true, completedAt: true, notes: true },
    take: 200,
  });
  const durations = recentCompleted
    .map((x) => diffMinutes(x.startedAt, x.completedAt))
    .filter((x): x is number => typeof x === "number");
  const avgCheckoutMinutesWeek =
    durations.length === 0
      ? null
      : Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10;

  const issuesCount = await prisma.checkOutTask.count({
    where: { status: "Completed", notes: { not: "" } },
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <div className="text-xs font-medium text-zinc-600">Tổng phòng</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {roomsTotal}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="green">Ready: {ready}</Badge>
              <Badge variant="blue">CheckedIn: {checkedIn}</Badge>
              <Badge variant="amber">Processing: {processing}</Badge>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs font-medium text-zinc-600">Nhân viên</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {staffCount}
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              Tài khoản &amp; phân công checkout
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs font-medium text-zinc-600">
              TG checkout TB (tuần)
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {avgCheckoutMinutesWeek === null ? "—" : `${avgCheckoutMinutesWeek} phút`}
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              Tính từ lúc chuyển “Processing” đến lúc “Ready”
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs font-medium text-zinc-600">
              Cảnh báo
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {issuesCount}
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              Có phòng ghi chú thiếu/mất đồ
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Thống kê nhanh"
          subtitle="Tổng quan theo tuần/tháng (đang mở rộng)."
        />
        <CardBody>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-sm font-medium text-zinc-900">Tuần này</div>
              <div className="mt-1 text-sm text-zinc-600">
                {durations.length} lượt checkout hoàn thành
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Median</span>
                  <span className="font-medium text-zinc-900">—</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">P90</span>
                  <span className="font-medium text-zinc-900">—</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-sm font-medium text-zinc-900">Tháng này</div>
              <div className="mt-1 text-sm text-zinc-600">
                (Sắp nối) thống kê tháng
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">TB</span>
                  <span className="font-medium text-zinc-900">—</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Phòng có issue</span>
                  <span className="font-medium text-zinc-900">—</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-sm font-medium text-zinc-900">
                KPI mục tiêu
              </div>
              <div className="mt-1 text-sm text-zinc-600">
                Target theo hạng phòng
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Deluxe</span>
                  <span className="font-medium text-zinc-900">≤ 15 phút</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Premium</span>
                  <span className="font-medium text-zinc-900">≤ 20 phút</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

