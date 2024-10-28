/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Division` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Division_nombre_key" ON "Division"("nombre");
