import { Button } from "@/components/ui/button";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui";

type Props = {
  reservaId: number;
  refresh: () => void;
};

export const CancelarReservaLaboratorio = ({ reservaId, refresh }: Props) => {
  const { mutate: cancelar, isPending } = api.reservas.reservarLaboratorioCerrado.cancelarReserva.useMutation();

  const [open, setOpen] = useState(false);

  const handleSave = () => {
    cancelar(
      { id: reservaId, motivo: "Cancelada por el usuario" },
      {
        onSuccess: () => {
          toast.success("Reserva cancelada con éxito.");
          refresh();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al cancelar la reserva");
        },
      },
    );
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Cancelar solicitud"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          title="Cancelar reserva"
          variant="icon"
          color="danger"
          icon={TrashIcon}
          className="h-8 w-8 px-2 py-2"
          isLoading={isPending}
        />
      }
      className={"max-h-[calc(100vh_-_10%)]"}
      isAlertDialog
      esEliminar
    >
      <div className="flex w-full flex-col gap-y-4">
        <div className="flex max-h-max w-full flex-col gap-4">¿Está seguro que desea cancelar la solicitud?</div>

        <div className="flex w-full flex-row justify-end gap-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cerrar
          </Button>
          <Button title="Cancelar" type="submit" variant="default" color="danger" onClick={handleSave}>
            Cancelar Reserva
          </Button>
        </div>
      </div>
    </ModalDrawer>
  );
};
