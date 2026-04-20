import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckoutClient } from "@/app/staff/checkout/[roomId]/checkout-client";

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

  if (!room) redirect("/staff/rooms");
  const task = room.tasks[0];
  if (!task) redirect("/staff/rooms");
  if (task.assignedToId !== user.id) redirect("/staff/rooms");
  if (room.status !== "CheckOutProcessing") redirect("/staff/rooms");

  // Ensure startedAt is set once the assignee opens the task.
  if (!task.startedAt) {
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

