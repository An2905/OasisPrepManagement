import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const mock = {
  rooms: 24,
  ready: 18,
  checkedIn: 4,
  processing: 2,
  employees: 6,
  avgCheckoutMinutesWeek: 17.4,
};

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <div className="text-xs font-medium text-zinc-600">Tổng phòng</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {mock.rooms}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="green">Ready: {mock.ready}</Badge>
              <Badge variant="blue">CheckedIn: {mock.checkedIn}</Badge>
              <Badge variant="amber">Processing: {mock.processing}</Badge>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs font-medium text-zinc-600">Nhân viên</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {mock.employees}
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
              {mock.avgCheckoutMinutesWeek} phút
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              Tính từ lúc chuyển “Processing” đến lúc “Ready”
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-xs font-medium text-zinc-600">
              Cảnh báo (demo)
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">2</div>
            <div className="mt-2 text-sm text-zinc-600">
              Có phòng ghi chú thiếu/mất đồ
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Thống kê nhanh"
          subtitle="Bản demo: sẽ nối dữ liệu theo tuần/tháng"
        />
        <CardBody>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-sm font-medium text-zinc-900">Tuần này</div>
              <div className="mt-1 text-sm text-zinc-600">
                38 lượt checkout • 6 nhân viên
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Median</span>
                  <span className="font-medium text-zinc-900">16 phút</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">P90</span>
                  <span className="font-medium text-zinc-900">28 phút</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-sm font-medium text-zinc-900">Tháng này</div>
              <div className="mt-1 text-sm text-zinc-600">
                156 lượt checkout • 6 nhân viên
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">TB</span>
                  <span className="font-medium text-zinc-900">18.2 phút</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Phòng có issue</span>
                  <span className="font-medium text-zinc-900">7</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-sm font-medium text-zinc-900">
                KPI mục tiêu (demo)
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

