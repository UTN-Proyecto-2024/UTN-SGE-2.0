import { api, type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { esFechaPasada, getTimeISOString } from "@/shared/get-date";
import { BadgeEstatusReserva } from "@/app/_components/badge-estatus-reserva";
import { Loader2 } from "lucide-react";

type LaboratorioCerradoReservaData =
  RouterOutputs["reservas"]["reservarLaboratorioCerrado"]["getAll"]["reservas"][number];

export const getColumnasReservasLaboratorioCerrado = ({ filterByUser }: { filterByUser?: boolean }) => {
  const colHelper = createColumnHelper<LaboratorioCerradoReservaData>();

  const columnasBasicas = [
    colHelper.accessor("fechaTexto", {
      header: "",
    }),
    colHelper.accessor("turnoTexto", {
      header: "",
    }),
    colHelper.accessor("id", {
      header: "#",
    }),
    colHelper.accessor("reserva.fechaHoraInicio", {
      header: "Hora Inicio",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getTimeISOString(reserva.fechaHoraInicio);

        return fecha;
      },
      meta: {
        cell: {
          align: "center",
        },
      },
    }),
    colHelper.accessor("reserva.fechaHoraFin", {
      header: "Hora Fin",
      cell: ({ row }) => {
        const { reserva } = row.original;

        const fecha = getTimeISOString(reserva.fechaHoraFin);

        return fecha;
      },
      meta: {
        cell: {
          align: "center",
        },
      },
    }),
    colHelper.accessor("curso.division.nombre", {
      header: "Division",
      cell: ({ row }) => {
        return row.original?.curso?.division.nombre ?? "-";
      },
    }),
    colHelper.accessor("curso.materia.nombre", {
      header: "Materia",
      cell: ({ row }) => {
        // Puede ser reserva discrecional
        return row.original?.curso?.materia.nombre ?? "-";
      },
    }),
    colHelper.accessor("curso.sede.nombre", {
      header: "Sede",
      cell: ({ row }) => {
        return row.original.sede.nombre;
      },
    }),
    colHelper.accessor("laboratorio.nombre", {
      header: "Laboratorio",
      cell: ({ row }) => {
        const { laboratorio, reserva } = row.original;
        const { estatus } = reserva;

        if (estatus === "CANCELADA") {
          return <span className="text-center">Cancelada</span>;
        }
        if (estatus === "RECHAZADA") {
          return <span className="text-center">Rechazada</span>;
        }

        // TODO @Santiago: No me parece correcto mostrar un estado incorrecto. Capaz sería pendiente y vencida o algo similar a charlar
        if (estatus === "PENDIENTE" && esFechaPasada(reserva.fechaHoraFin)) {
          return <span className="text-center">Rechazada</span>;
        }
        if (!laboratorio) {
          return <span className="text-center">No asignado</span>;
        }

        return laboratorio.nombre;
      },
    }),
    colHelper.display({
      header: "Reservas no asistidas",
      cell: (info) => {
        const { data: reservasQueNoAsistio = 0, isLoading } = api.admin.usuarios.reservasQueNoAsistioEsteAnno.useQuery(
          { userId: info.row.original.reserva.usuarioSolicito.id },
          { refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false },
        );

        if (isLoading) return <Loader2 className={"size-4 animate-spin"} />;

        return reservasQueNoAsistio;
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
    colHelper.accessor("reserva.estatus", {
      header: "Estado",
      cell: ({ row }) => {
        const { estatus } = row.original.reserva;

        return <BadgeEstatusReserva estatus={estatus} />;
      },
    }),
  ] as ColumnDef<LaboratorioCerradoReservaData>[];

  const columnas = filterByUser ? columnasBasicas : [...columnasBasicas];

  return columnas;
};

export const getColumnasResevaNames = () => {
  return [
    "#",
    "Laboratorio",
    "Nombre Laboratorio",
    "Sede",
    "Fecha de solicitud",
    "Inicio de Reserva",
    "Fin de Reserva",
    "Solicitado por",
  ];
};
