/*
  Warnings:

  - Added the required column `idNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "idNumber" TEXT NOT NULL;
