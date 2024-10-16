"use client";

import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { inputEditarCurso } from "@/shared/filters/cursos-filter.schema";
import { FormSelect } from "@/components/ui/autocomplete";
import { turnosValues } from "@/app/_components/turno-text";
import { SelectMateriasForm } from "@/app/cursos/_components/select-materia";
import { SelectDivisionesForm } from "../../_components/select-division";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";
import { DiaAdicionalForm } from "../../_components/cursos-dias-handler";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarCursoType = z.infer<typeof inputEditarCurso>;

const dias = [
  { id: "LUNES", label: "Lunes" },
  { id: "MARTES", label: "Martes" },
  { id: "MIERCOLES", label: "Miércoles" },
  { id: "JUEVES", label: "Jueves" },
  { id: "VIERNES", label: "Viernes" },
  { id: "SABADO", label: "Sábado" },
];

const aniosDeCarrera = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
];

const horas = ["0", "1", "2", "3", "4", "5", "6"].map((item) => ({
  id: item,
  label: item,
}));

const duracion = ["1", "2", "3", "4", "5", "6"].map((item) => ({
  id: item,
  label: item,
}));

const ac = [
  { id: "ANUAL", label: "Anual" },
  { id: "CUATRIMESTRAL", label: "Cuatrimestral" },
];

export const CursoForm = ({ id, onSubmit, onCancel }: Props) => {
  const { data: profesoresData } = api.admin.usuarios.getAllProfesores.useQuery();
  const profesores = useMemo(() => {
    return (
      profesoresData?.map((item) => {
        return { id: item.id, label: item.apellido + " " + item.nombre };
      }) ?? []
    );
  }, [profesoresData]);

  const [mostrarDia2, setMostrarDia2] = useState(false);

  const handleAddDia2 = () => {
    setMostrarDia2(true);
  };

  const handleRemoveDia2 = () => {
    formHook.setValue("dia2", undefined);
    formHook.setValue("horaInicio2", "");
    formHook.setValue("duracion2", "");
    setMostrarDia2(false);
  };

  const ayudantes = useMemo(() => {
    return (
      profesoresData?.map((item) => {
        return { id: item.id, label: item.apellido + " " + item.nombre };
      }) ?? []
    );
  }, [profesoresData]);

  const cursoId = parseInt(id ?? "");
  const { data: curso, isLoading, isError } = api.cursos.cursoPorId.useQuery({ id: cursoId }, { enabled: !!id });

  const editarCurso = api.cursos.editarCurso.useMutation(); // Se llama si existe cursoId
  const agregarCurso = api.cursos.nuevoCurso.useMutation(); // Se llama si no existe cursoId

  const formHook = useForm<FormEditarCursoType>({
    mode: "onChange",
    defaultValues: {
      id: curso?.id ?? undefined,
      horaInicio1: curso?.horaInicio1 ?? "",
      duracion1: curso?.duracion1 ?? "",
      horaInicio2: curso?.horaInicio2 ?? "",
      duracion2: curso?.duracion2 ?? "",
      dia1: curso?.dia1 ?? undefined,
      dia2: curso?.dia2 ?? undefined,
      profesorUserId: curso?.profesorId ?? "",
      ayudanteUsersIds: curso?.ayudantes?.map((a) => a.usuario.id) ?? [],
      anioDeCarrera: curso?.anioDeCarrera ?? undefined,
      activo: curso?.activo ?? true,
      ac: curso?.ac ?? "",
      sedeId: curso?.sedeId?.toString() ?? "",
      materiaId: curso?.materiaId.toString() ?? "",
      divisionId: curso?.division.id.toString() ?? "",
      turno: curso?.turno ?? undefined,
    },
    resolver: zodResolver(inputEditarCurso),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => {
    if (curso?.dia2) {
      setMostrarDia2(true);
    }
  }, [curso]);

  console.log(formHook.formState.errors);

  // TODO: Separar componente de formulario y logica de carga y actualización de curso
  useEffect(() => {
    if (curso) {
      formHook.reset({
        id: curso.id,
        horaInicio1: curso.horaInicio1,
        duracion1: curso.duracion1,
        horaInicio2: curso.horaInicio2 ?? "",
        duracion2: curso.duracion2 ?? "",
        dia1: curso.dia1,
        dia2: curso.dia2 ?? undefined,
        profesorUserId: curso.profesorId,
        ayudanteUsersIds: curso.ayudantes?.map((a) => a.usuario.id) ?? [],
        anioDeCarrera: curso.anioDeCarrera,
        activo: curso.activo,
        ac: curso.ac,
        sedeId: curso.sedeId?.toString(),
        materiaId: curso.materiaId.toString(),
        divisionId: curso.division?.id.toString(),
        turno: curso.turno,
      });
    }
  }, [formHook, curso]);

  const esNuevo = id === undefined;

  if (!esNuevo && isNaN(cursoId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarCursoType) => {
    formData.anioDeCarrera = Number(formData.anioDeCarrera);

    if (esNuevo) {
      agregarCurso.mutate(formData, {
        onSuccess: () => {
          toast.success("Curso agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el curso");
        },
      });
      return;
    }
    editarCurso.mutate(formData, {
      onSuccess: () => {
        toast.success("Curso actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el curso");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 px-0 md:px-6">
            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 w-full md:basis-2/3">
                <SelectMateriasForm
                  label={"Materia"}
                  control={control}
                  name="materiaId"
                  placeholder={"Seleccione una materia"}
                />
              </div>
              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 w-full md:basis-2/3">
                  <SelectSedeForm label={"Sede"} control={control} name="sedeId" placeholder={"Seleccione una sede"} />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full md:basis-2/3">
                <FormSelect label={"Duración"} control={control} name="ac" className="mt-2" items={ac} />
              </div>

              <div className="mt-4 w-full md:basis-2/3">
                <FormSelect label={"Turno"} control={control} name="turno" className="mt-2" items={turnosValues} />
              </div>

              <div className="mt-4 w-full md:basis-2/3">
                <select
                  {...formHook.register("anioDeCarrera", {
                    required: "Debes seleccionar un año",
                    valueAsNumber: true,
                    validate: (value) =>
                      typeof value === "number" && value >= 1 && value <= 6 ? true : "Selecciona un año válido",
                  })}
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccionar año</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>
              <div className="mt-4 w-full md:basis-1/3">
                <SelectDivisionesForm
                  label={"División"}
                  control={control}
                  name="divisionId"
                  placeholder={"Seleccione una división"}
                />
              </div>

              <div className="mt-4 basis-1/3">
                {/* <FormSelect label={"Sede"} control={control} name="sedeId" className="mt-2" items={sedes} /> */}
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormSelect label={"Día 1"} control={control} name="dia1" className="mt-2" items={dias} />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Hora inicio 1"}
                  control={control}
                  name="horaInicio1"
                  className="mt-2"
                  items={horas}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect label={"Duración 1"} control={control} name="duracion1" items={duracion} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              {mostrarDia2 ? (
                <DiaAdicionalForm
                  control={control}
                  dias={dias}
                  horas={horas}
                  duracion={duracion}
                  onRemove={handleRemoveDia2}
                />
              ) : (
                <button type="button" className="mt-4 text-blue-600" onClick={handleAddDia2}>
                  + Agregar Día 2
                </button>
              )}
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormSelect
                  label={"Profesor"}
                  control={control}
                  name="profesorUserId"
                  className="mt-2"
                  items={profesores}
                />
              </div>

              <div className="mt-4 basis-1/2">
                <FormSelect
                  label={"Ayudante"}
                  control={control}
                  name="ayudanteUsersIds"
                  className="mt-2"
                  items={ayudantes}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row items-end justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title="Guardar" type="submit" variant="default" color="primary">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
