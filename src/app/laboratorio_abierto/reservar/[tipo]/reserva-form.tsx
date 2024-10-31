import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect } from "react";
import {
  inputEditarReservaLaboratorioAbiertoSchema,
  inputReservaLaboratorioAbierto,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import { FormTextarea, Textarea } from "@/components/ui/textarea";
import { FormEquipoTipoSelector } from "@/app/laboratorios/_components/filtros/equipo-tipo-selector";
import { type LaboratorioAbiertoType } from "../_components/laboratorios";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";
import { esFechaPasada, getDateISOString, getTimeISOString } from "@/shared/get-date";
import { SelectEspecialidadForm } from "@/app/_components/select-especialidad";
import { FormInputPoliticas } from "@/app/_components/input-form-politicas";
import { LaboratorioAbiertoTipo, ReservaEstatus } from "@prisma/client";
import { ReservaDetalle } from "../../_components/info-basica-reserva";
import { FormSelect } from "@/components/ui/autocomplete";

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
} & ({ reservaId: number; tipo?: undefined } | { reservaId?: undefined; tipo: LaboratorioAbiertoType });

export type FormReservarLaboratorioAbiertoType = z.infer<typeof inputEditarReservaLaboratorioAbiertoSchema>;

const cantidadPersonas = [...Array(8).keys()].map((i) => (i + 1).toString());

export const LaboratorioAbiertoForm = ({ tipo, reservaId, onSubmit, onCancel }: Props) => {
  const esNuevo = reservaId === undefined;

  const crearReservaLaboratorioAbierto = api.reservas.reservaLaboratorioAbierto.crearReserva.useMutation();
  const modificarReservaLaboratorioAbierto = api.reservas.reservaLaboratorioAbierto.editarReserva.useMutation();
  const cancelarReservaLaboratorioAbierto = api.reservas.reservaLaboratorioAbierto.cancelarReserva.useMutation();
  const { data: reservaData } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery(
    {
      id: reservaId!,
    },
    {
      enabled: !esNuevo,
    },
  );

  const estaEstatusAprobada = reservaData?.reserva.estatus === ReservaEstatus.FINALIZADA;
  const estaEstatusCancelada = reservaData?.reserva.estatus === ReservaEstatus.CANCELADA;

  const esTLA =
    tipo === LaboratorioAbiertoTipo.TLA || reservaData?.laboratorioAbiertoTipo === LaboratorioAbiertoTipo.TLA;

  const formHook = useForm<FormReservarLaboratorioAbiertoType>({
    mode: "onChange",
    defaultValues: {
      id: reservaId,
      tipo: esNuevo ? tipo! : reservaData?.laboratorioAbiertoTipo,
      aceptoTerminos: false,
      concurrentes: esNuevo ? "1" : reservaData?.concurrentes.toString(),
      equipoReservado: esNuevo ? [] : (reservaData?.equipoReservado ?? []),
      fechaReserva: esNuevo ? undefined : getDateISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
      horaInicio: esNuevo ? undefined : getTimeISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
      horaFin: esNuevo ? undefined : getTimeISOString(reservaData?.reserva.fechaHoraFin as unknown as Date),
      observaciones: esNuevo ? "" : (reservaData?.descripcion ?? ""),
      sedeId: esNuevo ? undefined : String(reservaData?.sedeId),
    },
    resolver: zodResolver(
      (esNuevo ? inputReservaLaboratorioAbierto : inputEditarReservaLaboratorioAbiertoSchema).refine(
        ({ fechaReserva, horaInicio, horaFin }) => {
          const date1 = new Date(`${fechaReserva}T${horaInicio}`);
          const date2 = new Date(`${fechaReserva}T${horaFin}`);

          return date1 < date2;
        },
        {
          message: "Debe ser mayor a hora de inicio",
          path: ["horaFin"],
        },
      ),
    ),
  });

  const { handleSubmit, control, setValue } = formHook;

  useEffect(() => {
    if (reservaData) {
      formHook.reset({
        id: reservaId,
        tipo: esNuevo ? tipo! : reservaData?.laboratorioAbiertoTipo,
        aceptoTerminos: false,
        concurrentes: esNuevo ? "1" : reservaData?.concurrentes.toString(),
        equipoReservado: esNuevo ? [] : (reservaData?.equipoReservado ?? []),
        fechaReserva: esNuevo ? undefined : getDateISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
        horaInicio: esNuevo ? undefined : getTimeISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
        horaFin: esNuevo ? undefined : getTimeISOString(reservaData?.reserva.fechaHoraFin as unknown as Date),
        observaciones: esNuevo ? "" : (reservaData?.descripcion ?? ""),
        sedeId: esNuevo ? undefined : String(reservaData?.sedeId),
      });
    }
  }, [esNuevo, formHook, reservaData, reservaId, tipo]);

  useEffect(() => {
    if (esNuevo) {
      setValue("tipo", tipo!);
    }
  }, [esNuevo, tipo, setValue]);

  const onFormSubmit = async (formData: FormReservarLaboratorioAbiertoType) => {
    if (esNuevo) {
      crearReservaLaboratorioAbierto.mutate(formData, {
        onSuccess: () => {
          toast.success("Reserva creada con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al crear la reserva");
        },
      });

      return;
    }

    modificarReservaLaboratorioAbierto.mutate(formData, {
      onSuccess: () => {
        toast.success("Reserva actualizada con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar la reserva");
      },
    });
  };

  const handleClickClose = () => {
    formHook.reset();
    onCancel();
  };

  const handleCancelReserva = () => {
    cancelarReservaLaboratorioAbierto.mutate(
      { id: reservaId! },
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

  const haSidoRechazada = !!(
    reservaData &&
    reservaData?.reserva?.motivoRechazo &&
    reservaData.reserva.motivoRechazo.length > 0
  );

  const esReservaPasada = esFechaPasada(reservaData?.reserva?.fechaHoraFin);

  if (reservaId && esReservaPasada) {
    return <ReservaDetalle reservaId={reservaId} mostrarCompleto />;
  }

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col md:px-4">
        <ScrollArea className="max-h-[calc(100vh_-_300px)] w-full">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput label={"Tipo de laboratorio"} control={control} name="tipo" type={"text"} readOnly />
              <SelectSedeForm name="sedeId" label={"Sede"} control={control} placeholder={"Selecciona una sede"} />
              <FormSelect
                name={"concurrentes"}
                control={control}
                items={cantidadPersonas}
                label={"¿Cuántas personas concurrirán al laboratorio?"}
                clearable
              />
              <FormInput label={"Fecha de reserva"} control={control} name="fechaReserva" type={"date"} />
              <FormInput label={"Hora de inicio"} control={control} name="horaInicio" type={"time"} />
              <FormInput label={"Hora de fin"} control={control} name="horaFin" type={"time"} />
            </div>
            <div className="mx-auto space-y-6">
              {esTLA && (
                <SelectEspecialidadForm
                  name="especialidad"
                  label={"Especialidad"}
                  control={control}
                  placeholder={"Selecciona una especialidad"}
                />
              )}
              <FormTextarea
                label={"Breve descripción de la actividad"}
                control={control}
                name="observaciones"
                maxLength={250}
                showCharCount={true}
              />
              <FormEquipoTipoSelector name="equipoReservado" />
              {haSidoRechazada && (
                <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
                  <div className="mt-4 w-full">
                    <Textarea
                      label={"Motivo de rechazo"}
                      className="max-h-10 w-full"
                      placeholder="Escribí el motivo de rechazo"
                      readOnly
                      value={reservaData?.reserva.motivoRechazo ?? ""}
                    />
                  </div>
                </div>
              )}
              <FormInputPoliticas name="aceptoTerminos" control={control} />
            </div>
          </div>
        </ScrollArea>
        <div className="flex w-full flex-row items-end justify-end space-x-4 pt-4">
          <Button title="Cerrar" type="button" variant="default" color="secondary" onClick={handleClickClose}>
            Cerrar
          </Button>
          {!esNuevo && !estaEstatusCancelada && !esReservaPasada && (
            <Button
              title="Cancelar Reserva"
              type="button"
              variant="default"
              color="danger"
              onClick={handleCancelReserva}
            >
              Cancelar Reserva
            </Button>
          )}
          {!estaEstatusCancelada && !esReservaPasada && (
            <Button title="Guardar" type="submit" variant="default" color="primary">
              {estaEstatusAprobada ? "Modificar" : "Guardar"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
