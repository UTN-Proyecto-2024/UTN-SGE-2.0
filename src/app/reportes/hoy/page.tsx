import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense } from "react";
import PageLayout from "@/components/ui/template/page-template";
import { ActionButtons } from "../_actions/action-buttons";
import { REPORTES_ROUTE } from "@/shared/server-routes";
import { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { ReservasHoyTableContainer } from "./_components/table-container";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetAllLaboratorios.parse(searchParams);

  const filter_as_key = JSON.stringify(filters);

  return (
    <PageLayout route={REPORTES_ROUTE}>
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key}>
        <ReservasHoyTableContainer filters={filters} />
      </Suspense>
    </PageLayout>
  );
}
