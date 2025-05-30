import LaboratorioReservaTableContainer from "../_components/table/curso-table-container";
import { Suspense } from "react";
import LoadingCursosTable from "../_components/table/loading-curso-table";
import PageLayout from "@/components/ui/template/page-template";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import ReservaDiscrecionalModal from "../_components/reserva-discrecional-form";
import { AgregarAPantallaModal } from "../pantalla/_components/actions/agregar-pantalla";

export default async function Page() {
  return (
    <PageLayout
      route={LABORATORIO_ROUTE}
      buttons={
        <>
          <ReservaDiscrecionalModal />
          <AgregarAPantallaModal />
        </>
      }
    >
      <Suspense fallback={<LoadingCursosTable />}>
        <LaboratorioReservaTableContainer filterByUserId={true} filterByCatedraId={true} />
      </Suspense>
    </PageLayout>
  );
}
