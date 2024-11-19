import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { AgregarAPantallaModal } from "../../pantalla/_components/actions/agregar-pantalla";
import ReservaDiscrecionalModal from "../reserva-discrecional-form";
import { SgeNombre } from "@prisma/client";

export const LaboratorioActionButtonsLeft = () => {
  return (
    <>
      <TienePermiso permisos={[SgeNombre.RES_LAB_REALIZAR_RESERVA_DISCRECIONAL]}>
        <ReservaDiscrecionalModal />
      </TienePermiso>
      <TienePermiso permisos={[SgeNombre.RES_LAB_ABM_PANTALLA]}>
        <AgregarAPantallaModal />
      </TienePermiso>
    </>
  );
};
