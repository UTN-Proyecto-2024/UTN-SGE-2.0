import { AgregarAPantallaModal } from "../../pantalla/_components/actions/agregar-pantalla";
import ReservaDiscrecionalModal from "../reserva-discrecional-form";

export const LaboratorioActionButtonsLeft = () => {
  return (
    <>
      <ReservaDiscrecionalModal />
      <AgregarAPantallaModal />
    </>
  );
};
