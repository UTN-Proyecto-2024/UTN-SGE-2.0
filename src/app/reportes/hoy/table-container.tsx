import type { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { api } from "@/trpc/server";
import type { z } from "zod";
import { ReservasHoy } from "./table";

type reservaFilters = z.infer<typeof inputGetAllLaboratorios>;

type Reservas = {
  filters: reservaFilters;
};

export const ReservasHoyTableContainer = async ({ filters }: Reservas) => {
  const reservas = await api.reservas.reservasLaboratorio.getAll(filters);

  return <ReservasHoy reservas={reservas} />;
};
