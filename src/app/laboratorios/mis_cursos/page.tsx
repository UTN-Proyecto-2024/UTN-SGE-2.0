import { ActionButtons } from "../_components/action-buttons/action-buttons";
import LaboratorioReservaTableContainer from "../_components/table/curso-table-container";
import { Suspense } from "react";
import LoadingCursosTable from "../_components/table/loading-curso-table";
import { TienePermiso } from "@/app/biblioteca/tienePermiso";

export default async function Page() {
  return (
    <>
      <TienePermiso
        fallback={
          <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            No tenes permiso para ver esta pagina.
          </h3>
        }
      >
        <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Reserva Laboratorio - Mis cursos</h3>
        <ActionButtons />
        <Suspense fallback={<LoadingCursosTable />}>
          <LaboratorioReservaTableContainer filterByUserId={true} filterByCatedraId={false} />
        </Suspense>
      </TienePermiso>
    </>
  );
}
