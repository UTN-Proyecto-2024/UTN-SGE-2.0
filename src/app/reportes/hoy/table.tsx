"use client";

import { Button, DataTable } from "@/components/ui";
import { getDateISOString, getTimeISOString } from "@/shared/get-date";
import type { RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

type Reserva = RouterOutputs["reservas"]["reservasLaboratorio"]["getAll"][number];

export const getColumnasReservas = () => {
  const colHelper = createColumnHelper<Reserva>();

  return [
    colHelper.accessor("id", {
      header: "Reserva #",
    }),
    colHelper.display({
      header: "Fecha",
      cell: ({ row }) => getDateISOString(row.original.fechaHoraInicio).split("-").reverse().join("/"),
    }),
    colHelper.accessor("fechaHoraInicio", {
      header: "Hora inicio",
      cell: ({ row }) => getTimeISOString(row.original.fechaHoraInicio),
    }),
    colHelper.accessor("fechaHoraFin", {
      header: "Hora fin",
      cell: ({ row }) => getTimeISOString(row.original.fechaHoraFin),
    }),
    colHelper.accessor("division", {
      header: "Division",
      cell: ({ row }) => row.original.division ?? "N / A",
    }),
    colHelper.accessor("materia", {
      header: "Materia",
      // Puede ser reserva discrecional
      cell: ({ row }) => row.original.materia ?? "N / A",
    }),
    colHelper.accessor("sede", {
      header: "Sede",
    }),
    colHelper.accessor("laboratorio", {
      header: "Laboratorio",
    }),
    colHelper.accessor("profesor", {
      header: "Profesor",
      cell: ({ row }) => row.original.profesor ?? "N / A",
    }),
    colHelper.accessor("equipos", {
      header: "Equipos",
      cell: ({ row }) =>
        row.original.equipos && (
          <Fragment>
            {row.original.equipos.map((equipo, index) => (
              <div key={index}>{equipo}</div>
            ))}
          </Fragment>
        ),
    }),
    colHelper.accessor("descripcion", {
      header: "Observaciones",
    }),
  ] as ColumnDef<Reserva>[];
};

export const ReservasHoy = async ({ reservas }: { reservas: Reserva[] }) => {
  const columns = getColumnasReservas();
  return (
    <DataTable
      data={reservas ?? []}
      columns={columns}
      manualSorting
      action={{
        header: "Acciones",
        cell({ original }) {
          return (
            <Link href={`/reportes/solicitudes/${original.id}`} passHref prefetch={false}>
              <Button color={"outline"} className="h-8 w-8 px-1 py-1" variant={"icon"} icon={EyeIcon} />
            </Link>
          );
        },
      }}
    />
  );
};
