"use client";

import { DataTable } from "@/components/ui";
import RemoveEquipoModal from "./remove-equipo";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { useEquiposQueryParam } from "../_hooks/use-equipos-query-param";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { EditarEquipoModal } from "./edit-equipo";
import { type SortingState } from "@tanstack/react-table";
import { getEquiposColumnas } from "./columns";
import { type inputGetEquipos } from "@/shared/filters/equipos-filter.schema";
import { VerEquipoModal } from "./ver-equipo";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";
import { useTienePermisos } from "@/app/_hooks/use-tiene-permisos";

type EquiposData = RouterOutputs["equipos"]["getAll"];
type EquiposFilters = z.infer<typeof inputGetEquipos>;

type EquiposTableProps = {
  data: EquiposData;
  filters: EquiposFilters;
};

export const EquiposTable = ({ data, filters }: EquiposTableProps) => {
  const { tienePermisos } = useTienePermisos([SgeNombre.EQUIPOS_PRESTAMO_PRESTAR]);

  const { refresh, pagination, sorting, onSortingChange, onPaginationChange } = useEquiposQueryParam(filters);

  const columns = getEquiposColumnas({ tienePrestar: tienePermisos });

  // TODO: Implement resizing
  return (
    <>
      <DataTable
        data={data.equipos ?? []}
        columns={columns}
        manualSorting
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex}
        config={{
          sorting,
          onSortingChange: (updaterOrValue: SortingState | ((prevState: SortingState) => SortingState)) =>
            onSortingChange(typeof updaterOrValue === "function" ? updaterOrValue([]) : updaterOrValue),
        }}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <TienePermiso permisos={[SgeNombre.EQUIPOS_ABM]}>
                  <>
                    <RemoveEquipoModal
                      equipoId={original.id}
                      nombre={original.inventarioId}
                      disponible={original.disponible}
                      onSubmit={refresh}
                    />
                    <EditarEquipoModal equipoId={original.id} />
                  </>
                </TienePermiso>
                <TienePermiso permisos={[]}>
                  <VerEquipoModal equipoId={original.id} />
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
