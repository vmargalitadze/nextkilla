/*
  Warnings:

  - You are about to drop the column `seatId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `seatNumber` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `seatSelected` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `busId` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the `Bus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_seatId_fkey";

-- DropForeignKey
ALTER TABLE "Bus" DROP CONSTRAINT "Bus_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_busId_fkey";

-- DropIndex
DROP INDEX "Booking_seatId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "seatId",
DROP COLUMN "seatNumber",
DROP COLUMN "seatSelected";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "busId";

-- DropTable
DROP TABLE "Bus";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Seat";
