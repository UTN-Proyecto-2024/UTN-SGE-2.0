import { FormSelect } from "@/components/ui/autocomplete";

type Props = {
  control: any;
  dias: { id: string; label: string }[];
  horas: { id: string; label: string }[];
  duracion: { id: string; label: string }[];
  onRemove: () => void;
};

export const DiaAdicionalForm = ({ control, dias, horas, duracion, onRemove }: Props) => {
  return (
    <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
      <div className="mt-4 basis-1/3">
        <FormSelect label={"Día 2"} control={control} name="dia2" className="mt-2" items={dias} />
      </div>

      <div className="mt-4 basis-1/3">
        <FormSelect label={"Hora inicio 2"} control={control} name="horaInicio2" className="mt-2" items={horas} />
      </div>

      <div className="mt-4 basis-1/3">
        <FormSelect label={"Duración 2"} control={control} name="duracion2" className="mt-2" items={duracion} />
      </div>

      <button type="button" className="mt-4 text-red-600" onClick={onRemove}>
        Eliminar Día 2
      </button>
    </div>
  );
};
