import React, { useMemo } from "react";
import { format, startOfMonth, addDays, isBefore } from "date-fns";
import { clsx } from "clsx";
import type { z } from "zod";
import type { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import Link from "next/link";
import { api } from "@/trpc/server";

type ReportesFilters = z.infer<typeof inputGetAllLaboratorios>;
type Reserva = { id: number; materia?: string; division?: string; profesor: string; esDiscrecional: boolean };

type Props = {
  filters: ReportesFilters;
};

const WEEKDAYS = ["LAB", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DAYS_IN_CALENDAR = 35;
const COLORS = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-cyan-200",
  "bg-teal-200",
  "bg-lime-200",
];

export default async function Calendar({ filters }: Props) {
  const startOfCurrentMonth = useMemo(() => {
    return filters.desde ? new Date(filters.desde + "T07:00:00.000Z") : startOfMonth(new Date());
  }, [filters.desde]);

  const monthDates = useMemo(() => {
    return Array.from({ length: DAYS_IN_CALENDAR }, (_, index) =>
      addDays(startOfCurrentMonth, index - startOfCurrentMonth.getUTCDay()),
    );
  }, [startOfCurrentMonth]);

  const laboratoriosMap = await useMemo(async () => {
    const laboratorios = await api.laboratorios.getAll(filters);
    return laboratorios.map((laboratorio) => ({
      ...laboratorio,
      reservas: laboratorio.reservaLaboratorioCerrado.reduce<Record<string, Reserva[]>>((acc, reserva) => {
        const dateKey = format(reserva.reserva.fechaHoraInicio, "yyyy-MM-dd");
        return {
          ...acc,
          [format(reserva.reserva.fechaHoraInicio, "yyyy-MM-dd")]: [
            ...(acc[dateKey] ?? []),
            {
              id: reserva.reserva.id,
              materia: reserva.curso?.materia.nombre,
              division: reserva.curso?.division.nombre,
              profesor: reserva.esDiscrecional
                ? `${reserva.reserva.usuarioSolicito.nombre} ${reserva.reserva.usuarioSolicito.apellido}`
                : `${reserva.curso?.profesor.nombre} ${reserva.curso?.profesor.apellido}`,
              esDiscrecional: reserva.esDiscrecional,
            },
          ],
        };
      }, {}),
    }));
  }, [filters]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded">
      <div className="grid w-full grid-cols-[auto,1fr,1fr,1fr,1fr,1fr,1fr] overflow-auto rounded-md border">
        {WEEKDAYS.map((day) => (
          <div key={day} className={clsx("bg-gray-900 p-3 text-center text-sm text-white")}>
            {day}
          </div>
        ))}

        {Array.from({ length: 5 }).map((_, rowIndex) => {
          const weekDates = monthDates.slice(rowIndex * 7, (rowIndex + 1) * 7);

          return (
            <div className="col-span-7 grid grid-cols-subgrid divide-x rounded" key={rowIndex}>
              {weekDates.map((date, index) => (
                <div
                  key={index}
                  className={clsx(
                    "flex h-8 items-center justify-center border-y text-sm font-semibold",
                    (date.getMonth() !== startOfCurrentMonth.getMonth() || isBefore(date, today)) &&
                      index &&
                      "!bg-gray-50",
                    // calendar[format(date, "yyyy-MM-dd")] === Dia.FERIADO && "bg-blue-200",
                    // calendar[format(date, "yyyy-MM-dd")] === Dia.EXAMEN && "bg-yellow-200",
                  )}
                >
                  {date.getDay() === 0 ? "" : date.getDate()}
                </div>
              ))}

              {laboratoriosMap.map((laboratorio, color) =>
                weekDates.map((date, index, week) => {
                  const reservas = laboratorio.reservas[format(date, "yyyy-MM-dd")];
                  return index ? (
                    <div
                      key={index}
                      className={clsx(
                        "text-sm",
                        (date.getMonth() !== startOfCurrentMonth.getMonth() || isBefore(date, today)) && "bg-gray-50",
                      )}
                    >
                      {reservas
                        ? reservas.map((reserva) => (
                            <Link
                              key={reserva.id}
                              href={`/reportes/solicitudes/${reserva.id}`}
                              passHref
                              prefetch={false}
                            >
                              <div
                                className={clsx(
                                  "mx-1 mb-1 rounded-md px-2 py-1",
                                  !color && "mt-1",
                                  !isBefore(date, today) && COLORS[color],
                                )}
                              >
                                <strong>
                                  {reserva.esDiscrecional
                                    ? "Reserva discrecional"
                                    : `${reserva.materia} (${reserva.division})`}
                                </strong>{" "}
                                {reserva.profesor}
                              </div>
                            </Link>
                          ))
                        : ""}
                    </div>
                  ) : (
                    <div key={index}>
                      <div
                        className={clsx(
                          "mx-1 mb-1 rounded-md px-2",
                          !color && "mt-1",
                          week.some(
                            (date) => format(date, "yyyy-MM-dd") in laboratorio.reservas && !isBefore(date, today),
                          ) && COLORS[color] + " py-1",
                        )}
                      >
                        {laboratorio.nombre}
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
