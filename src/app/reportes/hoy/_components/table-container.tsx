"use client";

import type { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { api } from "@/trpc/react";
import type { z } from "zod";
import { ReservasHoy } from "./table";

type reservaFilters = z.infer<typeof inputGetAllLaboratorios>;

type Reservas = {
  filters: reservaFilters;
};

export const ReservasHoyTableContainer = async ({ filters }: Reservas) => {
  const { data: reservas } = api.reservas.reservasLaboratorio.getAll.useQuery(filters);

  return <ReservasHoy reservas={reservas ?? []} />;
};
