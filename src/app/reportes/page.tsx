import { type ReadonlyURLSearchParams } from "next/navigation";
import React, { Suspense, useMemo } from "react";
import PageLayout from "@/components/ui/page-template";
import { REPORTES_ROUTE } from "@/shared/server-routes";
import ReservasCalendarContainer from "./(listado)/reservas";
import { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { ActionButtons } from "./(listado)/action-buttons";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetAllSolicitudesReservaLaboratorioCerrado.parse(searchParams);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);
  return (
    <PageLayout route={REPORTES_ROUTE}>
      <ActionButtons filters={filters} />
      <div className="w-full">
        <Suspense key={filter_as_key}>
          <ReservasCalendarContainer filters={filters} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
