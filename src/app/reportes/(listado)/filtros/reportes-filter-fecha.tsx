"use client";

import React, { useState } from "react";
import { type z } from "zod";
import { useReportesQueryParam } from "../../_hooks/use-reportes-query-param";
import type { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, format, subMonths } from "date-fns";
import { es } from "date-fns/locale";

type ReportesFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type Props = {
  filters: ReportesFilters;
};

export const ReportesFilterFecha = ({ filters }: Props) => {
  const { onFechaChange } = useReportesQueryParam(filters);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    const previousMonth = subMonths(currentMonth, 1);
    setCurrentMonth(previousMonth);
    onFechaChange(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    onFechaChange(nextMonth);
  };

  return (
    <div className="flex w-full items-center gap-x-6 px-4">
      <button onClick={handlePreviousMonth} className="text-2xl font-bold">
        <ChevronLeft />
      </button>
      <button onClick={handleNextMonth} className="text-2xl font-bold">
        <ChevronRight />
      </button>
      <h2 className="text-center text-2xl">{format(currentMonth, "MMMM yyyy", { locale: es })}</h2>
    </div>
  );
};
