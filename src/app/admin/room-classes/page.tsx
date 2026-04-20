import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { RoomClassCreateInline } from "@/app/admin/room-classes/room-class-create";

export const dynamic = "force-dynamic";

export default async function AdminRoomClassesPage() {
  const classes = await prisma.roomClass.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { rooms: true, checklist: true } },
      checklist: { orderBy: [{ sortOrder: "asc" }, { label: "asc" }] },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Hạng phòng & checklist"
        subtitle="Danh sách hạng phòng và checklist dùng khi checkout."
      />
      <CardBody>
        <div className="mb-5 rounded-2xl border border-zinc-200 bg-white p-4">
          <RoomClassCreateInline />
        </div>
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
                    <Badge variant="blue">{c._count.rooms} phòng</Badge>
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    Checklist ({c._count.checklist} mục)
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.checklist.slice(0, 6).map((it) => (
                      <Badge key={it.id} variant="neutral">
                        {it.label}
                      </Badge>
                    ))}
                    {c.checklist.length > 6 ? (
                      <Badge variant="neutral">+{c.checklist.length - 6}</Badge>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" disabled>
                    Sửa
                  </Button>
                  <Button variant="danger" disabled>
                    Xoá
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {classes.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              Chưa có hạng phòng.
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

