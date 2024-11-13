import { api } from "@/trpc/server";
import Calendar from "./calendar";
import type { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import type { z } from "zod";

type ReportesFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type Props = {
  filters: ReportesFilters;
};

export default async function ReservasCalendarContainer({ filters }: Props) {
  const reservas = await api.reservas.reservarLaboratorioCerrado.getAll(filters);
  return <Calendar reservas={reservas} filters={filters} />;
}
