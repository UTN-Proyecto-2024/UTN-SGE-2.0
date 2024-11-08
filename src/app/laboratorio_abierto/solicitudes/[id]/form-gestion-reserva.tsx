import { ScrollArea } from "@/components/ui/scroll-area";
import { ReservaDetalle } from "@/app/laboratorio_abierto/_components/info-basica-reserva";
import { ReservaAprobacion } from "@/app/laboratorio_abierto/_components/reserva-gestion";
import { api } from "@/trpc/react";
import { esFechaPasada } from "@/shared/get-date";
import { ReservaEstatus } from "@prisma/client";

interface ReservaViewAdminProps {
  reservaId: number;
  onAprobar: () => void;
  onRechazar: () => void;
  onCancel: () => void;
}

export const ReservaViewAdmin = ({ reservaId, onCancel, onAprobar, onRechazar }: ReservaViewAdminProps) => {
  const { data: reservaData } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery({
    id: Number(reservaId),
  });

  const esReservaPasada = esFechaPasada(reservaData?.reserva?.fechaHoraFin);

  const estaCancelada = reservaData?.reserva.estatus === ReservaEstatus.CANCELADA;

  return (
    <ScrollArea className="max-h-[calc(100vh_-_300px)] w-full">
      <div className="mx-auto max-w-3xl space-y-6 pb-2">
        <ReservaDetalle reservaId={reservaId} mostrarCompleto={esReservaPasada} />
        {!esReservaPasada && !estaCancelada && (
          <ReservaAprobacion reservaId={reservaId} onCancel={onCancel} onAprobar={onAprobar} onRechazar={onRechazar} />
        )}
      </div>
    </ScrollArea>
  );
};

// TODO @Alex: si es reserva pasada, mostrar boton para indicar que asistió o no
