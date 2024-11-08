import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui";
import { SelectTutorForm } from "@/app/_components/select-tutor";
import { useEffect } from "react";
import { inputAprobarReservaLaboratorioAbiertoSchema } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { type z } from "zod";
import { SelectLaboratorioFormConEstadoReservaForm } from "@/app/_components/select-ubicacion/select-laboratorio";
import { api } from "@/trpc/react";
import { FormEquipoTipoSelector } from "@/app/laboratorios/_components/filtros/equipo-tipo-selector";
import { ReservaEstatus } from "@prisma/client";
import { esFechaPasada } from "@/shared/get-date";
import { getMensajeError } from "@/shared/error";
import { AdminLaboratoriosNuevoLaboratorio } from "@/app/laboratorios/_components/alerta-rechazar";

type FormHelperType = {
  tutor: { id: string; label: string };
};

type AprobarReservaFormData = z.infer<typeof inputAprobarReservaLaboratorioAbiertoSchema> & FormHelperType;

interface ReservaAprobacionProps {
  reservaId: number;
  onAprobar: () => void;
  onCancel: () => void;
  onRechazar: () => void;
}

export const ReservaAprobacion = ({ reservaId, onAprobar, onCancel, onRechazar }: ReservaAprobacionProps) => {
  const { isPending: estaAprobando, mutate: aprobarReserva } =
    api.reservas.reservaLaboratorioAbierto.aprobarReserva.useMutation();
  const { isPending: estaRechazando, mutate: rechazarReserva } =
    api.reservas.reservaLaboratorioAbierto.rechazarReserva.useMutation();
  const { data: reservaData } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery({
    id: reservaId,
  });
  const utils = api.useUtils();

  const formHook = useForm<AprobarReservaFormData>({
    mode: "onChange",
    resolver: zodResolver(inputAprobarReservaLaboratorioAbiertoSchema),
    defaultValues: {
      id: reservaId,
      inventarioRevisado: [],
      laboratorioId: reservaData?.laboratorioId ? String(reservaData?.laboratorioId) : undefined,
      tutorId: reservaData?.reserva.usuarioTutorId ?? undefined,
      tutor: {
        id: reservaData?.reserva.usuarioTutorId ?? undefined,
        label: `${reservaData?.reserva?.usuarioTutor?.apellido ?? ""} ${reservaData?.reserva?.usuarioTutor?.nombre ?? ""}`,
      },
      equipoReservado: reservaData?.equipoReservado ?? [],
    },
  });

  const { handleSubmit, control, watch } = formHook;

  useEffect(() => {
    if (reservaData) {
      const { laboratorioId, reserva, equipoReservado } = reservaData;
      const { usuarioTutor, usuarioTutorId } = reserva;
      formHook.reset({
        id: reservaId,
        inventarioRevisado: [],
        laboratorioId: laboratorioId ? String(laboratorioId) : undefined,
        tutorId: usuarioTutorId ?? undefined,
        tutor: {
          id: usuarioTutorId ?? undefined,
          label: usuarioTutor ? `${usuarioTutor.apellido ?? ""} ${usuarioTutor.nombre ?? ""}` : undefined,
        },
        equipoReservado: equipoReservado ?? [],
      });
    }
  }, [formHook, reservaData, reservaId]);

  const onSubmit = async (data: AprobarReservaFormData) => {
    aprobarReserva(data, {
      onSuccess: () => {
        toast.success("Reserva aprobada con éxito");
        onAprobar();

        // Durante el desarrollo funciono sin esto, pero no entendí porque.
        // Se supone que react-query cachea queries de tipo `get` entonces si cambia el laboratorio id de una reserva, deberiamos invalidar para que un cache no de mala información
        utils.reservas.laboratorioEnUso.obtenerReservasExistentesDeLaboratorio.invalidate().catch((err) => {
          console.error(err);
        });
      },
      onError: (err) => {
        const mensaje = getMensajeError(err, "Error al aprobar la reserva");

        toast.error(mensaje);
      },
    });
  };

  const handleRechazo = async (motivo: string) => {
    rechazarReserva(
      { id: reservaId, motivo },
      {
        onSuccess: () => {
          toast.success("Reserva rechazada con éxito");
          onRechazar();
        },
        onError: (err) => {
          const mensaje = getMensajeError(err, "Error al rechazar la reserva");

          toast.error(mensaje);
        },
      },
    );
  };

  const [tutor, laboratorioId] = watch(["tutor", "laboratorioId"]);
  useEffect(() => {
    if (tutor) {
      formHook.setValue("tutorId", tutor.id);
    } else {
      formHook.setValue("tutorId", undefined);
    }
  }, [formHook, tutor]);

  const estaEstatusPendiente = reservaData?.reserva.estatus === ReservaEstatus.PENDIENTE;
  const estaEstatusAprobada = reservaData?.reserva.estatus === ReservaEstatus.FINALIZADA;
  const estaCancelada = reservaData?.reserva.estatus === ReservaEstatus.CANCELADA;

  const esReservaPasada = esFechaPasada(reservaData?.reserva?.fechaHoraFin);

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Campos para Aprobación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <SelectTutorForm
                name="tutor"
                realNameId="tutorId"
                control={control}
                className="mt-2"
                label="Tutor (Opcional)"
              />
            </div>

            <div className="flex w-full flex-col gap-y-4">
              <SelectLaboratorioFormConEstadoReservaForm
                name="laboratorioId"
                control={control}
                className="mt-2"
                label="Laboratorio"
                placeholder="Selecciona un laboratorio"
                sedeId={reservaData?.sedeId ? String(reservaData?.sedeId) : undefined}
                excepcionReservaId={reservaId}
                fechaHoraInicio={reservaData?.reserva?.fechaHoraInicio}
                fechaHoraFin={reservaData?.reserva?.fechaHoraFin}
                laboratorioId={laboratorioId}
                esAbierto
              />
            </div>

            <div>
              <FormEquipoTipoSelector name="equipoReservado" />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-row justify-end space-x-4">
          <Button
            title="Cancelar"
            type="button"
            variant="default"
            color="secondary"
            onClick={onCancel}
            className="w-full"
            isLoading={estaAprobando || estaRechazando}
          >
            Cancelar
          </Button>
          {(estaEstatusPendiente || estaEstatusAprobada) && !esReservaPasada && (
            <AdminLaboratoriosNuevoLaboratorio estaRechazando={estaRechazando} handleRechazo={handleRechazo} />
          )}
          {!estaCancelada && !esReservaPasada && (
            <Button
              title="Aprobar"
              type="submit"
              variant="default"
              color="primary"
              disabled={estaAprobando}
              isLoading={estaAprobando}
              className="w-full"
            >
              {estaEstatusAprobada ? "Modificar" : "Aprobar"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
