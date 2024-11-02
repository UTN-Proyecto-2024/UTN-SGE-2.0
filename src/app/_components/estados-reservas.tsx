import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/components/utils";
import { ReservaEstatus } from "@prisma/client";

const reservaEstatus = [
  {
    id: ReservaEstatus.PENDIENTE,
    label: "Pendientes",
  },
  {
    id: ReservaEstatus.FINALIZADA,
    label: "Pasadas",
  },
  {
    id: ReservaEstatus.CANCELADA,
    label: "Canceladas",
  },
  {
    id: ReservaEstatus.RECHAZADA,
    label: "Rechazadas",
  },
  {
    id: "",
    label: "Todas",
  },
];

export const EstadoReservaToString = ({
  handleEstadoChange,
  currentEstado,
}: {
  handleEstadoChange: (estado: ReservaEstatus) => void;
  currentEstado: string;
}) => {
  return (
    <ToggleGroup type="single" className="flex flex-row justify-between overflow-auto rounded-lg bg-primary/20 p-1">
      {reservaEstatus.map(({ id: value, label }) => (
        <ToggleGroupItem
          key={value || "all"}
          value={value}
          aria-label={`Cambiar a ${label}`}
          className={cn("h-9 w-full text-center hover:bg-transparent", {
            "bg-primary/50 hover:bg-primary/50": currentEstado === value,
          })}
          onClick={() => handleEstadoChange(value as ReservaEstatus)}
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
