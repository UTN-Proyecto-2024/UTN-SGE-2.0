import type { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { armarFechaSinHorasALas0000, getDate } from "@/shared/get-date";
import type { PrismaClient } from "@prisma/client";
import type { z } from "zod";

type InputGetAllReservas = z.infer<typeof inputGetAllLaboratorios>;
export const getAllReservasToday = async (ctx: { db: PrismaClient }, input: InputGetAllReservas) => {
  const { sede, turno } = input;
  return await ctx.db.reserva.findMany({
    include: {
      usuarioTutor: true,
      reservaLaboratorioCerrado: {
        include: {
          equipoReservado: {
            include: {
              equipoTipo: true,
            },
          },
          laboratorio: true,
          curso: {
            include: {
              division: true,
              materia: true,
              profesor: true,
            },
          },
          sede: true,
        },
        where: {
          curso: { turno },
          sedeId: sede ? parseInt(sede) : undefined,
        },
      },
      reservaLaboratorioAbierto: {
        include: {
          equipoReservado: {
            include: {
              equipoTipo: true,
            },
          },
          laboratorio: true,
          sede: true,
        },
        where: {
          sedeId: sede ? parseInt(sede) : undefined,
        },
      },
    },
    where: {
      fechaHoraInicio: {
        gte: armarFechaSinHorasALas0000(getDate()),
        lte: armarFechaSinHorasALas0000(getDate(1)),
      },
    },
    orderBy: {
      fechaHoraInicio: "asc",
    },
  });
};
