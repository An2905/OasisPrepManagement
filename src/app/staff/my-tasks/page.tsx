import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StaffMyTasksPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const tasks = await prisma.checkOutTask.findMany({
    where: { assignedToId: user.id, status: { in: ["Assigned", "InProgress"] } },
    orderBy: { updatedAt: "desc" },
    include: { room: true },
  });

  return (
    <Card>
      <CardHeader
        title="Task của tôi"
        subtitle="Danh sách các phòng đang được bạn xử lý checkout."
      />
      <CardBody>
        <div className="grid gap-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-zinc-900">
                    Phòng {t.room.roomId}
                  </div>
                  <Badge variant="amber">{t.status}</Badge>
                </div>
                <div className="mt-1 text-sm text-zinc-600">
                  Bắt đầu:{" "}
                  {t.startedAt ? new Date(t.startedAt).toLocaleString() : "—"}
                </div>
              </div>
              <Link href={`/staff/checkout/${encodeURIComponent(t.room.roomId)}`}>
                <Button size="sm">Mở checklist</Button>
              </Link>
            </div>
          ))}
          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              Chưa có task nào.
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

