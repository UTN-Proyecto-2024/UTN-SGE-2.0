import { ActionButtons } from "./_components/action-buttons/action-buttons";
import LaboratorioAbiertoReservaContainer from "./_components/table/curso-table-container";
import { Suspense } from "react";
import LoadingLaboratorioAbiertoReserva from "./_components/table/loading-reserva-laboratorio-abierto";
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
        <ActionButtons />
        <Suspense fallback={<LoadingLaboratorioAbiertoReserva />}>
          <LaboratorioAbiertoReservaContainer />
        </Suspense>
      </TienePermiso>
    </>
  );
}
