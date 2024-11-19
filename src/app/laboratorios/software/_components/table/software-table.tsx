"use client";

import { DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { getColumns } from "./columns";
import { SoftwareNuevoEditar } from "../actions/software-nuevo";
import EliminarSoftwareModal from "../actions/software-eliminar";
import { useSoftwareQueryParam } from "@/app/laboratorios/_hooks/use-software-query-param";
import { type SortingState } from "@tanstack/react-table";
import { type z } from "zod";
import { type inputGetSoftwareFilter } from "@/shared/filters/laboratorio-filter.schema";

type SoftwareData = RouterOutputs["software"]["getAll"];
type SoftwareFilters = z.infer<typeof inputGetSoftwareFilter>;

type BibliotecaTableProps = {
  data: SoftwareData;
  filters: SoftwareFilters;
};

export const SoftwareTable = ({ data, filters }: BibliotecaTableProps) => {
  const { refresh, onSortingChange } = useSoftwareQueryParam(filters);

  const { software, laboratorios } = data;

  const columns = getColumns(laboratorios);

  return (
    <>
      <DataTable
        data={software ?? []}
        columns={columns}
        manualSorting
        config={{
          onSortingChange: (updaterOrValue: SortingState | ((prevState: SortingState) => SortingState)) => {
            return onSortingChange(typeof updaterOrValue === "function" ? updaterOrValue([]) : updaterOrValue);
          },
        }}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <EliminarSoftwareModal softwareId={original.id} nombre={original.nombre} onSubmit={refresh} />
                <SoftwareNuevoEditar softwareId={original.id} />
              </>
            );
          },
        }}
      />
    </>
  );
};
