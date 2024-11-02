import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type SoftwareData = RouterOutputs["software"]["getAll"]["software"][number];

export const getColumns = () => {
  const colHelper = createColumnHelper<SoftwareData>();

  return [
    colHelper.accessor("nombre", {
      header: "Programa",
    }),
    colHelper.accessor("version", {
      header: "Versión",
    }),
    colHelper.accessor("estado", {
      header: "Estado",
    }),
    colHelper.display({
      header: "Laboratorios",
      cell: (info) => {
        const laboratorios = info.row.original.laboratorios;
        return (
          <div className="flex flex-row ">
            {laboratorios.map((lab) => (
              <Badge key={lab.laboratorio.id} color="aqua" label={lab.laboratorio.nombre} />
            ))}
          </div>
        );
      },
      meta: {
        header: {
          hideSort: true,
        },
      },
    }),
  ] as ColumnDef<SoftwareData>[];
};

export const getColumnsNames = () => {
  return ["Programa", "Versión", "Estado", "Laboratorios"];
};
