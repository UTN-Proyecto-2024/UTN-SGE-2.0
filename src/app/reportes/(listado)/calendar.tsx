"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, addDays, isSameDay, isBefore } from "date-fns";
import { clsx } from "clsx";
import type { RouterOutputs } from "@/trpc/react";
import type { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import type { z } from "zod";

type Reservas = RouterOutputs["reservas"]["reservarLaboratorioCerrado"]["getAll"];
type ReportesFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type Props = {
  reservas: Reservas;
  filters: ReportesFilters;
};

const fetchHolidays = async (year: number) => {
  const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/AR`);
  if (!response.ok) {
    throw new Error("Failed to fetch holidays");
  }
  return await response.json();
};

export default function Calendar({ reservas, filters }: Props) {
  const [holidays, setHolidays] = useState<{ date: string; localName: string; name: string }[]>([]);
  const startOfCurrentMonth = filters.desde ? new Date(filters.desde) : startOfMonth(new Date());
  const today = new Date();

  useEffect(() => {
    fetchHolidays(new Date().getFullYear()).then(setHolidays).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded bg-white">
      <div className="grid w-full grid-cols-6 gap-0 overflow-hidden rounded-md shadow-md">
        {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
          <div key={day} className={clsx("bg-gray-900 p-3 text-center text-sm text-white")}>
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, index) => {
          const date = addDays(startOfCurrentMonth, index - startOfCurrentMonth.getDay());
          if (date.getDay() === 0) return;

          const reservationsForDate = reservas.reservas
            .filter((reserva) => isSameDay(reserva.reserva.fechaHoraInicio, date))
            .map((reserva) => ({
              id: reserva.id,
              text: (
                <span>
                  {" "}
                  <strong>{reserva.laboratorio?.nombre ?? "S/A"}</strong> {reserva.curso?.materia.nombre} (
                  {reserva.curso?.division.nombre}) {reserva.curso?.profesor.nombre} {reserva.curso?.profesor.apellido}
                </span>
              ),
              holiday: false,
            }));

          const isPast = isBefore(date, today);
          const holiday = holidays.find((holiday) => isSameDay(new Date(holiday.date), date));

          return (
            <div
              key={index}
              className={clsx(
                "h-auto min-h-40 overflow-auto border border-gray-100/40 p-2",
                date.getMonth() !== today.getMonth() ? "text-gray-400" : "text-gray-800",
                isPast && "bg-slate-100 text-gray-500",
                "flex flex-col",
              )}
            >
              <div className="mb-1 self-center text-sm font-semibold">{format(date, "d")}</div>
              {[...reservationsForDate, holiday && { id: holiday.localName, text: holiday.name, holiday: true }].map(
                (event) =>
                  event && (
                    <div
                      key={event.id}
                      className={clsx(
                        "mt-1 rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-900",
                        isPast && "!bg-slate-200 !text-gray-500",
                        holiday && "bg-yellow-200 text-yellow-900",
                      )}
                    >
                      {event.text}
                    </div>
                  ),
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
