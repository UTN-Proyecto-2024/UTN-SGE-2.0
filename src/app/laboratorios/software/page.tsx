import { Suspense, useMemo } from "react";
import LoadingSoftwareTable from "./_components/loading-software";
import SoftwareTableContainer from "./_components/table/container";
import PageLayout from "@/components/ui/page-template";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import { SoftwareNuevoEditar } from "./_components/actions/software-nuevo";
import { inputGetSoftwareFilter } from "@/shared/filters/laboratorio-filter.schema";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./_components/filtros/action-buttons";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetSoftwareFilter.parse(searchParams);

  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);
  return (
    <PageLayout
      route={LABORATORIO_ROUTE}
      buttons={
        <TienePermiso permisos={[SgeNombre.APLICACIONES_ABM]}>
          <SoftwareNuevoEditar />
        </TienePermiso>
      }
    >
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingSoftwareTable />}>
        <SoftwareTableContainer filters={filters} />
      </Suspense>
    </PageLayout>
  );
}
