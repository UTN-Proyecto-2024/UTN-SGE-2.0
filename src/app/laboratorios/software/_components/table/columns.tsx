import { type RouterOutputs } from "@/trpc/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LinuxLogo, WindowsLogo } from "@/app/_components/utn-logo";

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
    colHelper.display({
      header: "Sistema Operativo",
      cell: (info) => {
        const linux = info.row.original.linux;
        const windows = info.row.original.windows;

        return (
          <>
            {windows && (
              <Badge color="success">
                <WindowsLogo className="m-auto mr-2 h-4 w-4" />
                Windows
              </Badge>
            )}
            {linux && (
              <Badge color="success">
                <LinuxLogo className="m-auto mr-2 h-4 w-4" />
                Linux
              </Badge>
            )}
          </>
        );
      },
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
