import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalculatorIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PersonStandingIcon,
  SearchIcon,
  TextIcon,
  WrenchIcon,
} from "lucide-react";
import { Label } from "@/components/ui";
import { api } from "@/trpc/react";
import { BadgeEstatusReserva } from "@/app/_components/badge-estatus-reserva";
import { Skeleton } from "@/components/ui/skeleton";
import { getDateISOString, getTimeISOString } from "@/shared/get-date";
import { DatoUsuarioReserva } from "@/app/_components/datos-usuario";
import { MotivoRechazo } from "@/app/laboratorios/_components/rechazo-alert";

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
  } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery({
    id: Number(reservaId),
  });

  if (isError) {
    return <div>Error al cargar reserva...</div>;
  }

  if (isLoading) {
    return <CardLoading />;
  }

  if (!reserva) {
    return <div>Reserva no encontrada</div>;
  }

  const haSidoRechazada = !!(
    reserva?.reserva?.motivoRechazo &&
    reserva.reserva.motivoRechazo.length > 0 &&
    reserva.reserva.estatus === "RECHAZADA"
  );

  return (
    <>
      {haSidoRechazada && <MotivoRechazo motivoRechazo={reserva.reserva.motivoRechazo ?? ""} />}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex-grow text-center sm:text-left">
              <CardTitle className="mb-1 text-2xl">Reserva #{reserva.id}</CardTitle>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <BadgeEstatusReserva estatus={reserva.reserva.estatus} />
                <Badge color="secondary">{reserva.reserva.tipo}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid auto-cols-max grid-cols-2 gap-4 md:grid-cols-3">
            {[
              ...[
                {
                  icon: <CalendarIcon className="h-4 w-4" />,
                  label: "Fecha",
                  value: getDateISOString(reserva.reserva.fechaHoraInicio),
                },
                {
                  icon: <ClockIcon className="h-4 w-4" />,
                  label: "Hora de Inicio",
                  value: getTimeISOString(reserva.reserva.fechaHoraInicio),
                },
                {
                  icon: <ClockIcon className="h-4 w-4" />,
                  label: "Hora de Fin",
                  value: getTimeISOString(reserva.reserva.fechaHoraFin),
                },
                {
                  icon: <MapPinIcon className="h-4 w-4" />,
                  label: "Sede",
                  value: reserva.sede.nombre ?? "Sin asignar",
                },
                {
                  icon: <MapPinIcon className="h-4 w-4" />,
                  label: "Laboratorio",
                  value: reserva?.laboratorio?.nombre ?? "Sin asignar",
                },
                {
                  icon: <SearchIcon className="h-4 w-4" />,
                  label: "Especialidad",
                  value: reserva?.especialidad ?? "Sin asignar",
                },
                {
                  icon: <PersonStandingIcon className="h-4 w-4" />,
                  label: "Solicitante",
                  value: reserva?.reserva.usuarioSolicito
                    ? `${reserva.reserva.usuarioSolicito.nombre} ${reserva.reserva.usuarioSolicito.apellido}`
                    : "Sin asignar",
                },
                  {
                      icon: <CalculatorIcon className="h-4 w-4" />,
                      label: "Solicitudes hechas este año",
                      value: isLoadingReservasHechas ? "" : reservasHechas,
                  },
              ],
              ...(mostrarCompleto
                ? [
                    {
                      icon: <PersonStandingIcon className="h-4 w-4" />,
                      label: "Tutor",
                      value: <DatoUsuarioReserva usuario={reserva?.reserva.usuarioTutor} />,
                    },
                    {
                      icon: <WrenchIcon className="h-4 w-4" />,
                      label: "Equipo",
                      value:
                        reserva.equipoReservado.length > 0 ? (
                          <ul className="list-disc">
                            {reserva.equipoReservado.map((equipo) => (
                              <li key={equipo.equipoId} className="flex flex-row space-x-2 text-sm">
                                {equipo.equipoTipo.nombre} x {equipo.cantidad}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No se requiere"
                        ),
                    },
                  ]
                : []),
            ].map(({ icon, label, value }, index, array) => (
              <div
                key={index}
                className={`flex flex-row space-x-2 ${index === array.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <div className="flex items-start justify-center">{icon}</div>
                <div className="flex flex-col text-left">
                  <Label className="text-xs font-semibold">{label}</Label>
                  <p className="text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
          {reserva.descripcion && (
            <div className="col-span-3 space-y-2">
              <Label className="flex items-center font-semibold">
                <TextIcon className="mr-2 h-4 w-4" />
                Observaciones
              </Label>
              <div className="whitespace-pre-wrap rounded-md border border-gray-300 bg-gray-50 p-4">
                {reserva.descripcion ?? "Sin informar"}
              </div>
            </div>
          )}
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
            <Label className="flex items-center font-semibold">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Fecha de Inicio
            </Label>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <ClockIcon className="mr-2 h-4 w-4" />
              Hora de Inicio
            </Label>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Fecha de Fin
            </Label>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <ClockIcon className="mr-2 h-4 w-4" />
              Hora de Fin
            </Label>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <MapPinIcon className="mr-2 h-4 w-4" />
              Laboratorio Actual
            </Label>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
