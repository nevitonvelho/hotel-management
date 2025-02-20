/*
  Warnings:

  - The `guests` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "guests",
ADD COLUMN     "guests" TEXT[] DEFAULT ARRAY[]::TEXT[];
