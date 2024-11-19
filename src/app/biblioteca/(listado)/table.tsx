"use client";

import { DataTable } from "@/components/ui";
import RemoveLibroModal from "./remove-libro";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { type inputGetBooks } from "@/shared/filters/biblioteca-filter.schema";
import { useBibliotecaQueryParam } from "../_hooks/use-biblioteca-query-param";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { EditLibroModal } from "./edit-libro";
import { type SortingState } from "@tanstack/react-table";
import { getColumns } from "./columns";
import { VerLibroModal } from "./ver-libro";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

type LibroData = RouterOutputs["biblioteca"]["getAll"];
type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type BibliotecaTableProps = {
  data: LibroData;
  filters: BibliotecaFilters;
};

export const BibliotecaTable = ({ data, filters }: BibliotecaTableProps) => {
  const { refresh, pagination, sorting, onSortingChange, onPaginationChange } = useBibliotecaQueryParam(filters);

  const columns = getColumns();

  // TODO: Implement resizing
  return (
    <>
      <DataTable
        data={data.libros ?? []}
        columns={columns}
        manualSorting
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex}
        config={{
          sorting,
          onSortingChange: (updaterOrValue: SortingState | ((prevState: SortingState) => SortingState)) => {
            return onSortingChange(typeof updaterOrValue === "function" ? updaterOrValue([]) : updaterOrValue);
          },
        }}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <TienePermiso permisos={[SgeNombre.BIBLIOTECA_ABM_LIBRO]}>
                  <RemoveLibroModal
                    libroId={original.id}
                    nombre={original.titulo}
                    disponible={original.disponible}
                    onSubmit={refresh}
                  />
                </TienePermiso>
                <TienePermiso permisos={[SgeNombre.BIBLIOTECA_ABM_LIBRO]}>
                  <EditLibroModal libroId={original.id} />
                </TienePermiso>
                <TienePermiso permisos={[SgeNombre.BIBLIOTECA_VER_DETALLES_LIBRO]}>
                  <VerLibroModal libroId={original.id} />
                </TienePermiso>
              </>
            );
          },
        }}
      />

      <DataTablePaginationStandalone
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={data.count}
        onChange={onPaginationChange}
      />
    </>
  );
};
