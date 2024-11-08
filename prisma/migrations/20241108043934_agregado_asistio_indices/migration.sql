-- DropIndex
DROP INDEX "Reserva_estatus_idx";

-- DropIndex
DROP INDEX "Reserva_tipo_idx";

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "asistio" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Reserva_tipo_idx" ON "Reserva" USING HASH ("tipo");

-- CreateIndex
CREATE INDEX "Reserva_estatus_idx" ON "Reserva" USING HASH ("estatus");

-- CreateIndex
CREATE INDEX "Reserva_usuarioSolicitoId_idx" ON "Reserva" USING HASH ("usuarioSolicitoId");
