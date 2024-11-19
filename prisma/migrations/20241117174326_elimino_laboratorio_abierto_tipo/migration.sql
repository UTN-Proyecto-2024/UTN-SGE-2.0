/*
  Warnings:

  - You are about to drop the column `laboratorioAbiertoTipo` on the `Laboratorio` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Laboratorio_laboratorioAbiertoTipo_idx";

-- AlterTable
ALTER TABLE "Laboratorio" DROP COLUMN "laboratorioAbiertoTipo";
