import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

type RoomStatus = "Ready" | "CheckedIn" | "CheckOutProcessing";

function statusBadge(status: RoomStatus) {
  if (status === "Ready") return <Badge variant="green">Ready</Badge>;
  if (status === "CheckedIn") return <Badge variant="blue">CheckedIn</Badge>;
  return <Badge variant="amber">CheckOutProcessing</Badge>;
}

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
    status: "CheckedIn" as const,
    assignedTo: "-",
  },
  {
    roomId: "C-01",
    className: "Villa",
    location: "Khu C",
    status: "CheckOutProcessing" as const,
    assignedTo: "Trần Thị Bình",
  },
];

export default function AdminRoomsPage() {
  return (
    <Card>
      <CardHeader
        title="Phòng"
        subtitle="CRUD phòng theo hạng phòng. Khi chuyển trạng thái checkout, hệ thống sẽ tự phân nhân viên."
        right={
          <div className="flex gap-2">
            <Button variant="secondary">+ Thêm phòng</Button>
            <Button>+ Import nhanh</Button>
          </div>
        }
      />
      <CardBody>
        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium text-zinc-600">
              <tr>
                <th className="px-4 py-3">RoomId</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {rooms.map((r) => (
                <tr key={r.roomId} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {r.roomId}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{r.className}</td>
                  <td className="px-4 py-3 text-zinc-700">{r.location}</td>
                  <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  <td className="px-4 py-3 text-zinc-700">{r.assignedTo}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      Sửa
                    </Button>
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

