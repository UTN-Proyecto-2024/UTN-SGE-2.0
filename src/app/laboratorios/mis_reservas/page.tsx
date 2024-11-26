import { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import LaboratorioCerradoSolicitudesTableContainer from "../_components/table/reservas-labo-cerrado-table-container";
import LoadingBibliotecaPrestamosTable from "@/app/biblioteca/(listado)/loading-biblioteca-prestamos-table";
import PageLayout from "@/components/ui/template/page-template";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetAllSolicitudesReservaLaboratorioCerrado.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);

  return (
    <PageLayout route={LABORATORIO_ROUTE}>
      <Suspense key={filter_as_key} fallback={<LoadingBibliotecaPrestamosTable />}>
        <LaboratorioCerradoSolicitudesTableContainer filters={filters} filterByUser />
      </Suspense>
    </PageLayout>
  );
}
