import { Skeleton } from "@/components/ui/skeleton";
import LoadingAdminTable from "./_components/table/loading-admin-table";
import { adminRolesColumnas } from "./_components/table/columns";
import PageLayout from "@/components/ui/page-template";
import { AdminRolesNuevoRol } from "./_components/action-button/nuevo-rol-button";
import { ADMIN_ROUTE } from "@/shared/server-routes";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

export default function BibliotecaLoading() {
  return (
    <PageLayout
      route={ADMIN_ROUTE}
      buttons={
        <TienePermiso permisos={[]}>
          {/* TODO: no se cual seria el permiso que va??*/}
          <AdminRolesNuevoRol />
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

      <LoadingAdminTable columns={adminRolesColumnas} />
    </PageLayout>
  );
}
