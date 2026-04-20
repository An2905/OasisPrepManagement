import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutClient } from "@/app/staff/checkout/[roomId]/checkout-client";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function StaffCheckoutRoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/staff/rooms");

  const roomId = decodeURIComponent(params.roomId);
  const room = await prisma.room.findUnique({
    where: { roomId },
    include: {
      roomClass: { include: { checklist: { orderBy: [{ sortOrder: "asc" }, { label: "asc" }] } } },
      tasks: {
        where: { status: { in: ["Assigned", "InProgress"] } },
        orderBy: { updatedAt: "desc" },
        take: 1,
        include: { assignedTo: true },
      },
    },
  });

  let error: string | null = null;
  if (!room) error = "Không tìm thấy phòng.";
  const task = room?.tasks?.[0];
  if (!error && !task) error = "Phòng chưa có task checkout hoặc task đã kết thúc.";
  if (!error && task && task.assignedToId !== user.id) {
    error = `Task đang thuộc về nhân viên khác: ${task.assignedTo.displayName}.`;
  }
  if (!error && room && room.status !== "CheckOutProcessing") {
    error = `Trạng thái phòng hiện tại: ${room.status}.`;
  }

  if (error) {
    return (
      <Card>
        <CardHeader
          title={`Checkout phòng ${roomId}`}
          subtitle="Không thể mở checklist cho phòng này."
        />
        <CardBody>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {error}
          </div>
          <div className="mt-4">
            <Link href="/staff/rooms">
              <Button variant="secondary">Quay lại danh sách phòng</Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!room || !task) {
    // Should be impossible due to error handling above, but keeps TypeScript happy.
    redirect("/staff/rooms");
  }

  // Ensure startedAt is set once the assignee opens the task.
  if (task && !task.startedAt) {
    await prisma.checkOutTask.update({
      where: { id: task.id },
      data: { status: "InProgress", startedAt: new Date() },
    });
  }

  return (
    <CheckoutClient
      data={{
        roomId: room.roomId,
        className: room.roomClass.name,
        location: room.location,
        status: "CheckOutProcessing",
        assigneeName: task.assignedTo.displayName,
        checklist: room.roomClass.checklist.map((x) => x.label),
      }}
    />
  );
}

