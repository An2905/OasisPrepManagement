-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('Ready', 'CheckedIn', 'CheckOutProcessing');

-- CreateEnum
CREATE TYPE "CheckOutTaskStatus" AS ENUM ('Assigned', 'InProgress', 'Completed', 'Cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomClassChecklistItem" (
    "id" TEXT NOT NULL,
    "roomClassId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomClassChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'Ready',
    "roomClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckOutTask" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "status" "CheckOutTaskStatus" NOT NULL DEFAULT 'Assigned',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT NOT NULL DEFAULT '',
    "signatureName" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedById" TEXT,

    CONSTRAINT "CheckOutTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckOutChecklistResult" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckOutChecklistResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiTarget" (
    "id" TEXT NOT NULL,
    "roomClassId" TEXT NOT NULL,
    "targetMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RoomClass_name_key" ON "RoomClass"("name");

-- CreateIndex
CREATE INDEX "RoomClassChecklistItem_roomClassId_sortOrder_idx" ON "RoomClassChecklistItem"("roomClassId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "RoomClassChecklistItem_roomClassId_label_key" ON "RoomClassChecklistItem"("roomClassId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomId_key" ON "Room"("roomId");

-- CreateIndex
CREATE INDEX "CheckOutTask_roomId_status_idx" ON "CheckOutTask"("roomId", "status");

-- CreateIndex
CREATE INDEX "CheckOutTask_assignedToId_status_idx" ON "CheckOutTask"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "CheckOutTask_createdAt_idx" ON "CheckOutTask"("createdAt");

-- CreateIndex
CREATE INDEX "CheckOutChecklistResult_taskId_idx" ON "CheckOutChecklistResult"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckOutChecklistResult_taskId_label_key" ON "CheckOutChecklistResult"("taskId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "KpiTarget_roomClassId_key" ON "KpiTarget"("roomClassId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomClassChecklistItem" ADD CONSTRAINT "RoomClassChecklistItem_roomClassId_fkey" FOREIGN KEY ("roomClassId") REFERENCES "RoomClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomClassId_fkey" FOREIGN KEY ("roomClassId") REFERENCES "RoomClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOutTask" ADD CONSTRAINT "CheckOutTask_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOutTask" ADD CONSTRAINT "CheckOutTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOutTask" ADD CONSTRAINT "CheckOutTask_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckOutChecklistResult" ADD CONSTRAINT "CheckOutChecklistResult_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "CheckOutTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiTarget" ADD CONSTRAINT "KpiTarget_roomClassId_fkey" FOREIGN KEY ("roomClassId") REFERENCES "RoomClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

