/*
  Warnings:

  - You are about to drop the column `enDesuso` on the `Permiso` table. All the data in the column will be lost.
  - You are about to drop the column `grupo` on the `Permiso` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre,rubro]` on the table `Permiso` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rubro` to the `Permiso` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Permiso_nombre_grupo_key";

-- AlterTable
ALTER TABLE "Permiso" RENAME COLUMN "enDesuso" TO "incluido";
ALTER TABLE "Permiso" RENAME COLUMN "grupo" TO "rubro";
ALTER TABLE "Permiso" ALTER COLUMN     "incluido" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_nombre_rubro_key" ON "Permiso"("nombre", "rubro");
