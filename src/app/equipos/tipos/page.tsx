import { type ReadonlyURLSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoadingTiposTable from "./_components/table/loading-tipos-table";
import { EquiposTiposActionButtons } from "./_components/buttons/action-buttons";
import TiposTableContainer from "./_components/table/tipos-table-container";
import { equiposColumnas } from "./_components/table/columns";
import { inputGetTipos } from "@/shared/filters/equipos-tipos-filter.schema";
import { EQUIPOS_ROUTE } from "@/shared/server-routes";
import { EquiposTiposNuevoTipo } from "./_components/buttons/nuevo-tipo-button";
import PageLayout from "@/components/ui/template/page-template";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@/generated/prisma";

type PageProps = {
  searchParams: Promise<ReadonlyURLSearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const filters = inputGetTipos.parse(await searchParams);

  const filter_as_key = JSON.stringify(filters);

  return (
    <PageLayout
      route={EQUIPOS_ROUTE}
      buttons={
        <TienePermiso permisos={[SgeNombre.EQUIPOS_TIPO_ABM]}>
          <EquiposTiposNuevoTipo />
        </TienePermiso>
      }
    >
      <EquiposTiposActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingTiposTable columns={equiposColumnas} />}>
        <TiposTableContainer filters={filters} />
      </Suspense>
    </PageLayout>
  );
}
