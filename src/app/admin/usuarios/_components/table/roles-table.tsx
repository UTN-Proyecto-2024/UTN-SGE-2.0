"use client";

import { DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { EditarUsuarioModal } from "./edit-libro";
import { type SortingState } from "@tanstack/react-table";
import { getColumns } from "./columns";
import { useAdminUsuariosQueryParam } from "../../_hooks/use-admin-usuarios-query-param";
import { type inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";
import { DataTablePaginationStandalone } from "@/components/ui/table/table-pagination-standalone";
import { DetallesUsuarioPage } from "@/app/admin/usuarios/_components/table/detalles-usuario";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

type UsuariosData = RouterOutputs["admin"]["usuarios"]["getAll"];
type AdminUsuariosFilters = z.infer<typeof inputGetUsuarios>;

type Props = {
  data: UsuariosData;
  filters: AdminUsuariosFilters;
};

export const AdminUsuariosTable = ({ data, filters }: Props) => {
  const { sorting, pagination, onSortingChange, onPaginationChange } = useAdminUsuariosQueryParam(filters);

  const columns = getColumns();

  return (
    <>
      <DataTable
        data={data.usuarios ?? []}
        columns={columns}
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex}
        manualSorting
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
                <TienePermiso permisos={[]}>
                  <EditarUsuarioModal usuarioId={original.id} />
                </TienePermiso>
                <TienePermiso permisos={[SgeNombre.ADMIN_VER_FICHA_USUARIO]}>
                  <DetallesUsuarioPage usuarioId={original.id} />
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
