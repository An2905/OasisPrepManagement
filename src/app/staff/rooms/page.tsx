import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

type RoomStatus = "Ready" | "CheckedIn" | "CheckOutProcessing";

function statusBadge(status: RoomStatus) {
  if (status === "Ready") return <Badge variant="green">Ready</Badge>;
  if (status === "CheckedIn") return <Badge variant="blue">CheckedIn</Badge>;
  return <Badge variant="amber">CheckOutProcessing</Badge>;
}

const currentStaff = {
  name: "Nguyễn Văn An",
};

const rooms = [
  {
    roomId: "A-101",
    className: "Deluxe",
    location: "Khu A",
    status: "Ready" as const,
    assignedTo: "-",
  },
  {
    roomId: "A-102",
    className: "Deluxe",
    location: "Khu A",
    status: "CheckOutProcessing" as const,
    assignedTo: "Nguyễn Văn An",
  },
  {
    roomId: "B-201",
    className: "Premium",
    location: "Khu B",
    status: "CheckOutProcessing" as const,
    assignedTo: "Trần Thị Bình",
  },
  {
    roomId: "B-202",
    className: "Premium",
    location: "Khu B",
    status: "CheckedIn" as const,
    assignedTo: "-",
  },
];

export default function StaffRoomsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader
          title="Ca làm (demo)"
          subtitle={`Xin chào, ${currentStaff.name}. Các phòng CheckoutProcessing sẽ tự phân nhân viên.`}
          right={<Badge variant="neutral">Shift: 07:00–15:00</Badge>}
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2">
            {rooms.map((r) => {
              const mine = r.assignedTo === currentStaff.name;
              const canWork = r.status === "CheckOutProcessing" && mine;
              return (
                <div
                  key={r.roomId}
                  className="rounded-2xl border border-zinc-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-zinc-900">
                          {r.roomId}
                        </div>
                        {statusBadge(r.status)}
                        <Badge variant="neutral">{r.className}</Badge>
                        <Badge variant="neutral">{r.location}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-zinc-600">
                        Assigned:{" "}
                        <span className="font-medium text-zinc-900">
                          {r.assignedTo}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {canWork ? (
                        <Link href={`/staff/checkout/${encodeURIComponent(r.roomId)}`}>
                          <Button size="sm">Checkout</Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="secondary" disabled>
                          Checkout
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-zinc-600">
            Gợi ý UX: với phòng chưa assign cho bạn, nút sẽ disabled; khi nối backend
            sẽ hiển thị “Nhận task” hoặc “Đang được xử lý bởi …”.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

