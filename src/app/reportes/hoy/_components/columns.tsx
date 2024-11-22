import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { getDateISOString, getTimeISOString } from "@/shared/get-date";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type Reserva = RouterOutputs["reservas"]["reservasLaboratorio"]["getAll"][number];

export const getColumnasReservas = () => {
  const colHelper = createColumnHelper<Reserva>();

  return [
    colHelper.accessor("turnoTexto", {
      header: "",
    }),
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
    colHelper.display({
      header: "Docente",
      cell: ({ row }) => {
        const profesor = row.original.profesor;
        if (!profesor) {
          return "N / A";
        }

        return <DatoUsuarioReserva usuario={profesor} />;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.accessor("equipos", {
      header: "Equipos",
      cell: ({ row }) => {
        if (!row.original.equipos) return null;

        return row.original.equipos.map((equipo) => <div key={equipo}>{equipo}</div>);
      },
    }),
    colHelper.accessor("descripcion", {
      header: "Observaciones",
    }),
  ] as ColumnDef<Reserva>[];
};
