import bcrypt from "bcryptjs";
import {
  CheckOutTaskStatus,
  PrismaClient,
  RoomStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const staffPasswordHash = await bcrypt.hash("nv123", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      displayName: "Admin",
      role: UserRole.ADMIN,
      active: true,
      passwordHash: adminPasswordHash,
    },
    create: {
      username: "admin",
      displayName: "Admin",
      role: UserRole.ADMIN,
      active: true,
      passwordHash: adminPasswordHash,
    },
  });

  const staff = await prisma.user.upsert({
    where: { username: "nv01" },
    update: {
      displayName: "Nguyễn Văn An",
      role: UserRole.STAFF,
      active: true,
      passwordHash: staffPasswordHash,
    },
    create: {
      username: "nv01",
      displayName: "Nguyễn Văn An",
      role: UserRole.STAFF,
      active: true,
      passwordHash: staffPasswordHash,
    },
  });

  const deluxe = await prisma.roomClass.upsert({
    where: { name: "Deluxe" },
    update: { location: "Khu A" },
    create: { name: "Deluxe", location: "Khu A" },
  });
  const premium = await prisma.roomClass.upsert({
    where: { name: "Premium" },
    update: { location: "Khu B" },
    create: { name: "Premium", location: "Khu B" },
  });

  await prisma.roomClassChecklistItem.createMany({
    data: [
      ...["Remote TV", "Khăn tắm", "Dép", "Minibar", "Máy sấy tóc"].map((label, i) => ({
        roomClassId: deluxe.id,
        label,
        sortOrder: i,
      })),
      ...["Remote TV", "Khăn tắm", "Dép", "Minibar", "Két sắt", "Áo choàng"].map((label, i) => ({
        roomClassId: premium.id,
        label,
        sortOrder: i,
      })),
    ],
    skipDuplicates: true,
  });

  await prisma.kpiTarget.upsert({
    where: { roomClassId: deluxe.id },
    update: { targetMinutes: 15 },
    create: { roomClassId: deluxe.id, targetMinutes: 15 },
  });
  await prisma.kpiTarget.upsert({
    where: { roomClassId: premium.id },
    update: { targetMinutes: 20 },
    create: { roomClassId: premium.id, targetMinutes: 20 },
  });

  await prisma.room.upsert({
    where: { roomId: "A-102" },
    update: { roomClassId: deluxe.id, location: "Khu A", status: RoomStatus.CheckOutProcessing },
    create: {
      roomId: "A-102",
      roomClassId: deluxe.id,
      location: "Khu A",
      status: RoomStatus.CheckOutProcessing,
    },
  });

  await prisma.room.upsert({
    where: { roomId: "A-101" },
    update: { roomClassId: deluxe.id, location: "Khu A", status: RoomStatus.Ready },
    create: { roomId: "A-101", roomClassId: deluxe.id, location: "Khu A", status: RoomStatus.Ready },
  });

  await prisma.checkOutTask.upsert({
    where: { id: "seed-task-a-102" },
    update: {},
    create: {
      id: "seed-task-a-102",
      roomId: (await prisma.room.findUniqueOrThrow({ where: { roomId: "A-102" } })).id,
      assignedToId: staff.id,
      status: CheckOutTaskStatus.InProgress,
      startedAt: new Date(Date.now() - 8 * 60 * 1000),
      notes: "",
      signatureName: "",
    },
  });

  console.log("Seed complete:", { admin: admin.username, staff: staff.username });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

