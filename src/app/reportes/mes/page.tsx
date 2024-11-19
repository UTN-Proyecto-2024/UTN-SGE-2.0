import { type ReadonlyURLSearchParams } from "next/navigation";
import React, { Suspense, useMemo } from "react";
import PageLayout from "@/components/ui/page-template";
import { REPORTES_ROUTE } from "@/shared/server-routes";
import { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { ActionButtons } from "../_actions/action-buttons";
import Calendar from "./calendar";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetAllLaboratorios.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout route={REPORTES_ROUTE}>
      <ActionButtons filters={filters} monthly={true} />
      <Suspense key={filter_as_key}>
        <Calendar filters={filters} />
      </Suspense>
    </PageLayout>
  );
}
