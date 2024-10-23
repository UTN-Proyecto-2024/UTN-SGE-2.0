-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "mostrarEnPantalla" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Pantalla" (
    "id" SERIAL NOT NULL,
    "docente" TEXT NOT NULL,
    "materia" TEXT,
    "laboratorio" TEXT,
    "fechaHoraInicio" TIMESTAMP(3) NOT NULL,
    "fechaHoraFin" TIMESTAMP(3) NOT NULL,
    "usuarioCreadorId" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pantalla_pkey" PRIMARY KEY ("id")
);
