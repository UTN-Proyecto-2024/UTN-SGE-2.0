import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalculatorIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PersonStandingIcon,
  TextIcon,
  WrenchIcon,
} from "lucide-react";
import { api } from "@/trpc/react";
import {
  BadgeDiscrecionalReserva,
  BadgeEstatusReserva,
  BadgeLaboratorioAbiertoReserva,
} from "@/app/_components/badge-estatus-reserva";
import { Skeleton } from "@/components/ui/skeleton";
import { getDateISOString, getTimeISOString } from "@/shared/get-date";
import { MotivoRechazo } from "./rechazo-alert";

type ReservaDetalleProps = {
  reservaId: number;
  mostrarCompleto?: boolean;
};

export const ReservaDetalle = ({ reservaId, mostrarCompleto }: ReservaDetalleProps) => {
  const { data: reservasHechas = 0, isLoading: isLoadingReservasHechas } =
    api.admin.usuarios.reservasHechasPorUsuario.useQuery();
  const {
    data: reserva,
    isLoading,
    isError,
  } = api.reservas.reservarLaboratorioCerrado.getReservaPorID.useQuery({
    id: Number(reservaId),
  });

  const haSidoRechazada = !!(reserva?.reserva?.motivoRechazo && reserva.reserva.motivoRechazo.length > 0);

  if (isError) {
    return <div>Error al cargar reserva...</div>;
  }

  if (isLoading) {
    return <CardLoading />;
  }

  if (!reserva) {
    return <div>Reserva no encontrada</div>;
  }

  return (
    <>
      {haSidoRechazada && <MotivoRechazo motivoRechazo={reserva.reserva.motivoRechazo ?? ""} />}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex-grow text-center sm:text-left">
              <CardTitle className="mb-1 text-2xl">Reserva #{reserva.id}</CardTitle>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <BadgeEstatusReserva estatus={reserva.reserva.estatus} />
                <BadgeDiscrecionalReserva esDiscrecional={reserva.esDiscrecional} />
                <BadgeLaboratorioAbiertoReserva tipo={reserva.reserva.tipo} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <b className="flex items-center text-sm font-semibold">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Fecha
              </b>
              <p>{getDateISOString(reserva.reserva.fechaHoraInicio)}</p>
            </div>
            <div className="space-y-2">
              <b className="flex items-center text-sm font-semibold">
                <ClockIcon className="mr-2 h-4 w-4" />
                Hora de Inicio
              </b>
              <p>{getTimeISOString(reserva.reserva.fechaHoraInicio)}</p>
            </div>
            <div className="space-y-2">
              <b className="flex items-center text-sm font-semibold">
                <ClockIcon className="mr-2 h-4 w-4" />
                Hora de Fin
              </b>
              <p>{getTimeISOString(reserva.reserva.fechaHoraFin)}</p>
            </div>

            <div className="space-y-2">
              <b className="flex items-center text-sm font-semibold">
                <MapPinIcon className="mr-2 h-4 w-4" />
                Sede
              </b>
              <p>{reserva.sede.nombre ?? "Sin asignar"}</p>
            </div>

            <div className="space-y-2">
              <b className="flex items-center text-sm font-semibold">
                <MapPinIcon className="mr-2 h-4 w-4" />
                Laboratorio
              </b>
              <p>{reserva?.laboratorio?.nombre ?? "Sin asignar"}</p>
            </div>

            {mostrarCompleto && (
              <>
                <div className="space-y-2">
                  <b className="flex items-center text-sm font-semibold">
                    <WrenchIcon className="mr-2 h-4 w-4" />
                    Equipo
                  </b>
                  <ul className="list-disc pl-2">
                    {reserva.equipoReservado.map((equipo) => {
                      return (
                        <li key={equipo.equipoId} className="flex flex-row space-x-2">
                          {equipo.equipoTipo.nombre} x {equipo.cantidad}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {reserva.descripcion && (
                  <div className="col-span-3 space-y-2">
                    <b className="flex items-center text-sm font-semibold">
                      <TextIcon className="mr-2 h-4 w-4" />
                      Observaciones
                    </b>
                    <div className="whitespace-pre-wrap rounded-md border border-gray-300 bg-gray-50 p-4">
                      {reserva.descripcion ?? "Sin informar"}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <b className="flex items-center text-sm font-semibold">
                <PersonStandingIcon className="h-4 w-4" />
                Solicitante
              </b>
              <p>
                {reserva?.reserva.usuarioSolicito
                  ? `${reserva.reserva.usuarioSolicito.nombre} ${reserva.reserva.usuarioSolicito.apellido}`
                  : "Sin asignar"}
              </p>
            </div>

            <div className="space-y-2">
              <b className="flex items-center text-sm font-semibold">
                <CalculatorIcon className="h-4 w-4" />
                Solicitudes hechas este año
              </b>
              <p>{isLoadingReservasHechas ? "" : reservasHechas}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const CardLoading = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex-grow text-center sm:text-left">
            <CardTitle className="mb-1 text-2xl">Reserva #</CardTitle>
            <Skeleton className="mb-2 h-4 w-full" />
            <div className="flex flex-row gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <b className="flex items-center text-sm font-semibold">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Fecha de Inicio
            </b>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <b className="flex items-center text-sm font-semibold">
              <ClockIcon className="mr-2 h-4 w-4" />
              Hora de Inicio
            </b>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <b className="flex items-center text-sm font-semibold">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Fecha de Fin
            </b>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <b className="flex items-center text-sm font-semibold">
              <ClockIcon className="mr-2 h-4 w-4" />
              Hora de Fin
            </b>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <b className="flex items-center text-sm font-semibold">
              <MapPinIcon className="mr-2 h-4 w-4" />
              Laboratorio Actual
            </b>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
