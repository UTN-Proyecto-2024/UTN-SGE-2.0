import type { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { api } from "@/trpc/server";
import { useMemo } from "react";
import type { z } from "zod";
import { ReservasHoy } from "./table";

type reservaFilters = z.infer<typeof inputGetAllLaboratorios>;

type Reservas = {
  filters: reservaFilters;
};

export const ReservasHoyTableContainer = async ({ filters }: Reservas) => {
  const reservas = await useMemo(async () => {
    return await api.reservas.reservasLaboratorio.getAll(filters);
  }, [filters]);
  return <ReservasHoy reservas={reservas} />;
};
