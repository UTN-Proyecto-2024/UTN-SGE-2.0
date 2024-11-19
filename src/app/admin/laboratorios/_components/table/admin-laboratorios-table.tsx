"use client";

import { DataTable } from "@/components/ui";
import RemoverLaboratorioModal from "./remove-laboratorio";
import { type RouterOutputs } from "@/trpc/react";
import { type z } from "zod";
import { EditarLaboratorioModal } from "./edit-laboratorio";
import { getColumns } from "./columns";
import { useAdminLaboratoriosQueryParam } from "../../_hooks/use-admin-laboratorios-query-param";
import { type inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";

type LaboratoriosData = RouterOutputs["admin"]["laboratorios"]["getAll"];
type AdminLaboratoriosFilters = z.infer<typeof inputGetLaboratorios>;

type LaboratorioTableProps = {
  data: LaboratoriosData;
  filters: AdminLaboratoriosFilters;
};

export const AdminLaboratoriosTable = ({ data, filters }: LaboratorioTableProps) => {
  const { refresh } = useAdminLaboratoriosQueryParam(filters);

  const sortedData = [...(data.laboratorios ?? [])].sort((a, b) => a.nombre.localeCompare(b.nombre));
  const columns = getColumns();

  return (
    <>
      <DataTable
        data={sortedData ?? []}
        columns={columns}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <RemoverLaboratorioModal laboratorioId={original.id} nombre={original.nombre} onSubmit={refresh} />
                <EditarLaboratorioModal laboratorioId={original.id} />
              </>
            );
          },
        }}
      />
    </>
  );
};
