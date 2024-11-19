import { Skeleton } from "@/components/ui/skeleton";
import LoadingTiposTable from "./_components/table/loading-tipos-table";
import { equiposColumnas } from "./_components/table/columns";
import PageLayout from "@/components/ui/page-template";
import { EQUIPOS_ROUTE } from "@/shared/server-routes";
import { EquiposTiposNuevoTipo } from "./_components/buttons/nuevo-tipo-button";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

export default function TiposLoading() {
  return (
    <PageLayout
      route={EQUIPOS_ROUTE}
      buttons={
        <TienePermiso permisos={[SgeNombre.EQUIPOS_TIPO_ABM]}>
          <EquiposTiposNuevoTipo />
        </TienePermiso>
      }
    >
      <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5 md:space-y-0">
        <div className="relative flex w-full flex-row justify-end md:w-auto md:basis-1/3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="w-full md:basis-1/3">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <LoadingTiposTable columns={equiposColumnas} />
    </PageLayout>
  );
}
