-- AlterTable
ALTER TABLE "ReservaLaboratorioCerrado" ADD COLUMN     "discrecionalDocenteId" TEXT,
ADD COLUMN     "discrecionalMateriaId" INTEGER,
ADD COLUMN     "discrecionalTitulo" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_discrecionalMateriaId_fkey" FOREIGN KEY ("discrecionalMateriaId") REFERENCES "Materia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaLaboratorioCerrado" ADD CONSTRAINT "ReservaLaboratorioCerrado_discrecionalDocenteId_fkey" FOREIGN KEY ("discrecionalDocenteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
