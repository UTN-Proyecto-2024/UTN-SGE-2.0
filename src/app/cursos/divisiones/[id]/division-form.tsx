import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditarDivision, inputAgregarDivision } from "@/shared/filters/divisiones-filter.schema"; // Reemplazar con el schema adecuado
import { type z } from "zod";
import { useEffect, useMemo } from "react";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

// const anios = ["1", "2", "3", "4", "5", "6"].map((item) => ({
//   id: item,
//   label: item,
// }));

type FormEditarDivisionType = z.infer<typeof inputEditarDivision>;

export const DivisionForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const divisionId = parseInt(id ?? "");

  const {
    data: division,
    isLoading,
    isError,
  } = api.division.getDivisionById.useQuery({ id: divisionId }, { enabled: !!id });

  const editarDivision = api.division.editarDivision.useMutation();
  const agregarDivision = api.division.nuevaDivision.useMutation();

  const divisionBase: FormEditarDivisionType = useMemo(() => {
    if (!division) return {} as FormEditarDivisionType;
    return {
      id: division.id,
      nombre: division.nombre,
      anio: division.anio ?? 0,
    };
  }, [division]);

  const formHook = useForm<FormEditarDivisionType>({
    mode: "onChange",
    defaultValues: divisionBase,
    resolver: zodResolver(id ? inputEditarDivision : inputAgregarDivision),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => formHook.reset(divisionBase), [formHook, divisionBase]);

  const onFormSubmit = (formData: FormEditarDivisionType) => {
    if (esNuevo) {
      agregarDivision.mutate(formData, {
        onSuccess: () => {
          toast.success("División agregada con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar la división");
        },
      });
      return;
    }

    editarDivision.mutate(formData, {
      onSuccess: () => {
        toast.success("División actualizada con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar la división");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  if (!esNuevo && isNaN(divisionId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-8 md:px-4">
        <ScrollArea className="max-h-[calc(100vh_-_20%)] w-full md:max-h-[calc(100vh_-_30%)] lg:max-h-[calc(100vh_-_30%)]">
          <div className="space-y-4">
            <FormInput
              label={"Nombre"}
              control={control}
              name="nombre"
              type={"text"}
              className="bg-white text-gray-900"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Año</label>
              <select
                {...formHook.register("anio", {
                  required: "Debes seleccionar un año",
                  valueAsNumber: true,
                  validate: (value) =>
                    typeof value === "number" && value >= 1 && value <= 6 ? true : "Selecciona un año válido",
                })}
                className="mt-3 block h-10 w-full rounded-md border-gray-300 bg-white px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Seleccionar año</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
              </select>
              {formHook.formState.errors.anio && (
                <span className="text-red-500">{formHook.formState.errors.anio.message ?? "El año es requerido"}</span>
              )}
            </div>
          </div>
        </ScrollArea>
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
