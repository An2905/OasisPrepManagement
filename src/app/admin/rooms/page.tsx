import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import type { RoomStatus } from "@prisma/client";
import { StartCheckoutButton } from "@/app/admin/rooms/start-checkout-button";
import { RoomCreateInline } from "@/app/admin/rooms/room-create";
import { RoomActions } from "@/app/admin/rooms/room-actions";

export const dynamic = "force-dynamic";

function statusBadge(status: RoomStatus) {
  if (status === "Ready") return <Badge variant="green">Ready</Badge>;
  if (status === "CheckedIn") return <Badge variant="blue">CheckedIn</Badge>;
  return <Badge variant="amber">CheckOutProcessing</Badge>;
}

export default async function AdminRoomsPage() {
  const roomClasses = await prisma.roomClass.findMany({
    select: { id: true, name: true, location: true },
    orderBy: { name: "asc" },
  });
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
    <Card>
      <CardHeader
        title="Phòng"
        subtitle="CRUD phòng theo hạng phòng. Khi chuyển trạng thái checkout, hệ thống sẽ tự phân nhân viên."
      />
      <CardBody>
        <div className="mb-5 rounded-2xl border border-zinc-200 bg-white p-4">
          <RoomCreateInline roomClasses={roomClasses} />
        </div>
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
                  <td className="px-4 py-3 text-zinc-700">{r.roomClass.name}</td>
                  <td className="px-4 py-3 text-zinc-700">{r.location}</td>
                  <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {r.tasks[0]?.assignedTo?.displayName ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      {r.status !== "CheckOutProcessing" ? (
                        <StartCheckoutButton roomId={r.roomId} />
                      ) : null}
                      <RoomActions
                        id={r.id}
                        location={r.location}
                        roomClassId={r.roomClassId}
                        roomClasses={roomClasses}
                        canDelete={r.tasks.length === 0}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rooms.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            Chưa có phòng.
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

