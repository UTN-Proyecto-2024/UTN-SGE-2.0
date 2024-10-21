/*
  Warnings:

  - Added the required column `sedeId` to the `Pantalla` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pantalla" ADD COLUMN     "sedeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pantalla" ADD CONSTRAINT "Pantalla_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("id") ON DELETE CASCADE ON UPDATE CASCADE;
