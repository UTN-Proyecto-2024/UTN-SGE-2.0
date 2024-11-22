import { HelperReserva } from "@/server/api/repositories/reservas/pantalla.repository";
import { getTimeISOString } from "@/shared/get-date";
import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

type ReservaPantallaData = RouterOutputs["reservas"]["pantalla"]["getAllActivas"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<ReservaPantallaData>();

  return [
    colHelper.accessor("turnoTexto", {
      header: "",
    }),
    colHelper.display({
      header: "Tipo",
      cell: ({ row }) => {
        const { tipo } = row.original;

        if (tipo === HelperReserva.RESERVA) {
          return "Reserva de Laboratorio";
        }

        if (tipo === HelperReserva.PANTALLA) {
          return "Agregado a Pantalla";
        }

        return "-";
      },
    }),
    colHelper.accessor("materia", {
      header: "Materia",
    }),
    colHelper.accessor("sede", {
      header: "Sede",
    }),
    colHelper.accessor("laboratorio", {
      header: "Laboratorio",
    }),
    colHelper.accessor("fechaHoraInicio", {
      header: "Hora de inicio",
      cell: ({ getValue }) => {
        const hora = getValue();

        return getTimeISOString(hora);
      },
    }),
    colHelper.accessor("fechaHoraFin", {
      header: "Hora de fin",
      cell: ({ getValue }) => {
        const hora = getValue();

        return getTimeISOString(hora);
      },
    }),
  ] as ColumnDef<ReservaPantallaData>[];
};

export const getColumnsNames = () => {
  return ["Docente", "Materia", "Laboratorio", "Hora de inicio"];
};
