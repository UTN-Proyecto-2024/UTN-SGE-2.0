import { type ReadonlyURLSearchParams } from "next/navigation";
import { ActionButtons } from "./(listado)/action-buttons";
import CursoTableContainer from "./(listado)/curso-table-container";
import { Suspense, useMemo } from "react";
import LoadingCursosTable from "./(listado)/loading-curso-table";
import { inputGetCursos } from "@/shared/filters/cursos-filter.schema";
import React from "react";
import { CursosNuevoCurso } from "./(listado)/cursos-new-curso";
import { CURSOS_ROUTE } from "@/shared/server-routes";
import PageLayout from "@/components/ui/template/page-template";
import { CargarCursos } from "./(listado)/cursos-bulk-insert";
import { TienePermiso } from "../_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = useMemo(() => inputGetCursos.parse(searchParams), [searchParams]);
  const filter_as_key = useMemo(() => JSON.stringify(filters), [filters]);
  return (
    <PageLayout
      route={CURSOS_ROUTE}
      buttons={
        <>
          <TienePermiso permisos={[SgeNombre.CURSOS_ABM]}>
            <>
              <CursosNuevoCurso />
              <CargarCursos />
            </>
          </TienePermiso>
        </>
      }
    >
      <ActionButtons filters={filters} />
      <Suspense key={filter_as_key} fallback={<LoadingCursosTable />}>
        <CursoTableContainer filters={filters} filterByUser={false} />
      </Suspense>
    </PageLayout>
  );
}
