import { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { getAllReservas } from "../../repositories/laboratorios/laboratorios.repository";
import { protectedProcedure } from "../../trpc";

export const getAllLaboratoriosProcedure = protectedProcedure
  .input(inputGetAllLaboratorios)
  .query(async ({ ctx, input }) => {
    const laboratorios = await getAllReservas(ctx, input);
    return laboratorios;
  });
