import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import EditDivisionModal from "./edit-division";

type DivisionesData = RouterOutputs["division"]["getFiltered"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<DivisionesData>();

  return [
    colHelper.accessor("anio", {
      header: "Año",
    }),
    colHelper.display({
      header: "Divisiones",
      cell: (info) => (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {info.row.original.divisiones.map((division) => (
            <EditDivisionModal key={division.id} divisionId={division.id.toString()} divisionName={division.nombre} />
          ))}
        </div>
      ),
    }),
  ] as ColumnDef<DivisionesData>[];
};

export const getColumnsNames = () => {
  return ["Nombre de División", "Año"];
};
