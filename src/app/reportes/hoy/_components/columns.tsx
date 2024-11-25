import { BadgeDiscrecionalReserva } from "@/app/_components/badge-estatus-reserva";
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { getFechaHumanoDDMMYYYY, getTimeISOString } from "@/shared/get-date";
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
      cell: ({ row }) => getFechaHumanoDDMMYYYY(row.original.fechaHoraInicio),
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
      cell: ({ row }) => {
        const { esDiscrecional } = row.original;

        if (esDiscrecional) {
          return <BadgeDiscrecionalReserva esDiscrecional />;
        }

        return row.original.division ?? "N / A";
      },
    }),
    colHelper.accessor("materia", {
      header: "Materia",
      cell: ({ row }) => {
        const { esDiscrecional } = row.original;

        if (esDiscrecional) {
          const { discrecionalMateria, discrecionalTitulo } = row.original;

          if (discrecionalMateria && discrecionalMateria.nombre) {
            return discrecionalMateria.nombre;
          }

          if (discrecionalTitulo) {
            return discrecionalTitulo;
          }

          return "-";
        }

        return row.original.materia ?? "N / A";
      },
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
        const { esDiscrecional, discrecionalDocente } = row.original;
        if (esDiscrecional) {
          if (discrecionalDocente) {
            return <DatoUsuarioReserva usuario={discrecionalDocente} />;
          }

          return "-";
        }

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
