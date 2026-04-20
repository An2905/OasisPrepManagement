import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const classes = [
  {
    id: "deluxe",
    name: "Deluxe",
    location: "Khu A",
    rooms: 12,
    checklist: ["Remote TV", "Khăn tắm", "Dép", "Minibar", "Máy sấy tóc"],
  },
  {
    id: "premium",
    name: "Premium",
    location: "Khu B",
    rooms: 8,
    checklist: ["Remote TV", "Khăn tắm", "Dép", "Minibar", "Két sắt", "Áo choàng"],
  },
  {
    id: "villa",
    name: "Villa",
    location: "Khu C",
    rooms: 4,
    checklist: ["Remote TV", "Khăn tắm", "Dép", "Minibar", "Bếp", "Bồn tắm", "Loa"],
  },
];

export default function AdminRoomClassesPage() {
  return (
    <Card>
      <CardHeader
        title="Hạng phòng & checklist"
        subtitle="Admin tạo hạng phòng; mỗi hạng phòng có checklist đồ để nhân viên check khi checkout."
        right={<Button>+ Tạo hạng phòng</Button>}
      />
      <CardBody>
        <div className="grid gap-4">
          {classes.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-zinc-900">
                      {c.name}
                    </div>
                    <Badge variant="neutral">{c.location}</Badge>
                    <Badge variant="blue">{c.rooms} phòng</Badge>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    Checklist ({c.checklist.length} mục)
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.checklist.slice(0, 6).map((it) => (
                      <Badge key={it} variant="neutral">
                        {it}
                      </Badge>
                    ))}
                    {c.checklist.length > 6 ? (
                      <Badge variant="neutral">+{c.checklist.length - 6}</Badge>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary">Sửa</Button>
                  <Button variant="danger">Xoá</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

