import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import type { RoomStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function statusBadge(status: RoomStatus) {
  if (status === "Ready") return <Badge variant="green">Ready</Badge>;
  if (status === "CheckedIn") return <Badge variant="blue">CheckedIn</Badge>;
  return <Badge variant="amber">CheckOutProcessing</Badge>;
}

export default async function StaffRoomsPage() {
  const currentStaff = await getSessionUser();
  if (!currentStaff) return null;

  const rooms = await prisma.room.findMany({
    orderBy: [{ location: "asc" }, { roomId: "asc" }],
    include: {
      roomClass: true,
      tasks: {
        where: { status: { in: ["Assigned", "InProgress"] } },
        orderBy: { updatedAt: "desc" },
        take: 1,
        include: { assignedTo: true },
      },
    },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader
          title="Danh sách phòng"
          subtitle={`Xin chào, ${currentStaff.displayName}.`}
          right={<Badge variant="neutral">{currentStaff.username}</Badge>}
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2">
            {rooms.map((r) => {
              const assignedName = r.tasks[0]?.assignedTo?.displayName ?? "-";
              const mine = r.tasks[0]?.assignedToId === currentStaff.id;
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
                        <Badge variant="neutral">{r.roomClass.name}</Badge>
                        <Badge variant="neutral">{r.location}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-zinc-600">
                        Assigned:{" "}
                        <span className="font-medium text-zinc-900">
                          {assignedName}
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
          {rooms.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              Chưa có phòng.
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}

