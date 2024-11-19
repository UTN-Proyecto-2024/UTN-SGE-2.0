import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import EditDivisionModal from "./edit-division";
import { AnnoTexto } from "@/app/_components/anno-texto";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

type DivisionesData = RouterOutputs["division"]["getFiltered"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<DivisionesData>();

  return [
    colHelper.accessor("anio", {
      header: "Año",
      cell: ({ row }) => {
        const { anio } = row.original;

        return <AnnoTexto anio={anio} />;
      },
    }),
    colHelper.display({
      header: "Divisiones",
      cell: (info) => (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {info.row.original.divisiones.map((division) => (
            <TienePermiso permisos={[SgeNombre.DIVISIONES_ABM]}>
              {/* TODO: si no tiene permisos, no va a ver ninguna division. No se si esta tan bien */}
              <EditDivisionModal key={division.id} divisionId={division.id.toString()} divisionName={division.nombre} />
            </TienePermiso>
          ))}
        </div>
      ),
    }),
  ] as ColumnDef<DivisionesData>[];
};

export const getColumnsNames = () => {
  return ["Nombre de División", "Año"];
};
