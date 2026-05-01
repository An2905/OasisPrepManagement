-- CreateEnum
CREATE TYPE "StaffShift" AS ENUM ('Ca1', 'Ca2', 'Ca3');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "shift" "StaffShift";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN "points" INTEGER NOT NULL DEFAULT 1;

-- Existing staff accounts default to Ca1 so assignment keeps working
UPDATE "User" SET "shift" = 'Ca1'::"StaffShift" WHERE "role" = 'STAFF'::"UserRole";
