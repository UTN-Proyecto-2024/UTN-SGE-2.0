import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/components/utils";
import { ReservaEstatus } from "@prisma/client";

export const EstadoReservaToString = ({
  handleEstadoChange,
  currentEstado,
}: {
  handleEstadoChange: (estado: ReservaEstatus) => void;
  currentEstado: string;
}) => {
  return (
    <ToggleGroup type="single" className="flex flex-row justify-between overflow-auto rounded-lg bg-primary/20 p-1">
      {[...Object.values(ReservaEstatus), ""].map((value) => (
        <ToggleGroupItem
          key={value || "all"}
          value={value}
          aria-label={`Cambiar a ${value.toLowerCase() || "todas"}`}
          className={cn("h-9 w-full text-center hover:bg-transparent", {
            "bg-primary/50 hover:bg-primary/50": currentEstado === value,
          })}
          onClick={() => handleEstadoChange(value as ReservaEstatus)}
        >
          {value.length > 0 ? value[0] + value.slice(1).toLowerCase() : "Todas"}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
