import { type z } from "zod";
import { ReportesFilterSede } from "./filtros/reportes-filter-sede";
import { ReportesFilterTurno } from "./filtros/reportes-filter-turno";
import type { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { ReportesFilterFecha } from "./filtros/reportes-filter-fecha";

type ReportesFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type ActionButtonsProps = {
  filters: ReportesFilters;
};

export const ActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:space-x-1.5 lg:flex-row lg:space-y-0">
      <div className="w-full space-y-3 md:flex md:flex-row md:space-x-3 md:space-y-0">
        <ReportesFilterFecha filters={filters} />
        <div className="md:basis-1/5">
          <ReportesFilterSede filters={filters} />
        </div>
        <div className="md:basis-1/5">
          <ReportesFilterTurno filters={filters} />
        </div>
      </div>
    </div>
  );
};
