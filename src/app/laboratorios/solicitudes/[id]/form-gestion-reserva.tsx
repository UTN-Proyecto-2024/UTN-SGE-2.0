import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import { esFechaPasada } from "@/shared/get-date";
import { ReservaDetalle } from "../../_components/info-basica-reserva";
import { ReservaAprobacion } from "../../_components/reserva-gestion";
import { ReservaEstatus } from "@prisma/client";
import { Button, toast } from "@/components/ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClockIcon } from "lucide-react";

interface ReservaViewAdminProps {
  reservaId: number;
  onAprobar: () => void;
  onRechazar: () => void;
  onCancel: () => void;
}

export const ReservaViewAdmin = ({ reservaId, onCancel, onAprobar, onRechazar }: ReservaViewAdminProps) => {
  const { data: reservaData } = api.reservas.reservarLaboratorioCerrado.getReservaPorID.useQuery({
    id: Number(reservaId),
  });

  const cancelarReservaLaboratorio = api.reservas.reservarLaboratorioCerrado.cancelarReserva.useMutation();
  const handleCancelReserva = () => {
    cancelarReservaLaboratorio.mutate(
      { id: reservaId, motivo: "Cancelada por el usuario" },
      {
        onSuccess: () => {
          toast.success("Reserva cancelada con éxito.");
          onCancel();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al cancelar la reserva");
        },
      },
    );
  };

  const esReservaPasada = esFechaPasada(reservaData?.reserva?.fechaHoraFin);
  const estaCancelada = reservaData?.reserva.estatus === ReservaEstatus.CANCELADA;
  const esReservaPendientePasada =
    esReservaPasada && !estaCancelada && reservaData?.reserva.estatus === ReservaEstatus.PENDIENTE;

  return (
    <ScrollArea className="max-h-[calc(100vh_-_300px)]">
      <div className="container mx-auto space-y-8 p-4">
        {esReservaPendientePasada && (
          <Alert variant={"destructive"} className="w-full bg-red-500 text-white">
            <AlertTitle className="flex flex-row items-center">
              <ClockIcon className="mr-2 h-4 w-4" />
              Reserva pendiente pasada
            </AlertTitle>
            <AlertDescription>
              <p className="text-sm">
                <b>
                  Esta reserva quedo en el estado pendiente y se encuentra en el pasado, solo es posible cancelarla.
                </b>
              </p>
            </AlertDescription>
          </Alert>
        )}
        <ReservaDetalle reservaId={reservaId} mostrarCompleto={true} />
        {!esReservaPasada && !estaCancelada && (
          <ReservaAprobacion reservaId={reservaId} onCancel={onCancel} onAprobar={onAprobar} onRechazar={onRechazar} />
        )}
        {esReservaPendientePasada && (
          // boton para cancelar la reserva
          <div className="flex justify-end">
            <Button
              title="Cancelar Reserva"
              type="button"
              variant="default"
              color="danger"
              onClick={handleCancelReserva}
            >
              Cancelar Reserva
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
