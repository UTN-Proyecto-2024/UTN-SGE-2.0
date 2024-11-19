import type { z } from "zod";
import { type PrismaClient } from "@prisma/client";
import type { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { construirFechaReservaSinOffset } from "@/shared/get-date";

type InputGetAllReservas = z.infer<typeof inputGetAllLaboratorios>;
export const getAllReservas = async (ctx: { db: PrismaClient }, input: InputGetAllReservas) => {
  const { sede, turno, desde, hasta } = input;
  return await ctx.db.laboratorio.findMany({
    include: {
      reservaLaboratorioCerrado: {
        include: {
          reserva: true,
          curso: {
            include: {
              division: true,
              materia: true,
              profesor: true,
            },
          },
        },
        where: {
          reserva: {
            fechaHoraInicio: {
              gte: desde ? construirFechaReservaSinOffset(desde) : undefined,
              lte: hasta ? construirFechaReservaSinOffset(hasta) : undefined,
            },
          },
          curso: {
            turno,
          },
        },
      },
    },
    where: {
      sedeId: sede ? parseInt(sede) : undefined,
      nombre: {
        in: ["LAB101", "LAB104", "LAB105", "LAB108", "LAB109", "LAB110", "LAB061", "LAB062", "LAB063", "LAB064"],
      },
    },
  });
};
