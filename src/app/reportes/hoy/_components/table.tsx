"use client";

import { Button, DataTable } from "@/components/ui";
import type { RouterOutputs } from "@/trpc/react";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { type GroupingState } from "@tanstack/react-table";
import { useState } from "react";
import { getColumnasReservas } from "./columns";

type Reserva = RouterOutputs["reservas"]["reservasLaboratorio"]["getAll"][number];

export const ReservasHoy = ({ reservas }: { reservas: Reserva[] }) => {
  const columns = getColumnasReservas();

  const [grouping, setGrouping] = useState<GroupingState>(["turnoTexto"]);

  return (
    <DataTable
      data={reservas ?? []}
      columns={columns}
      grouping={grouping}
      setGrouping={setGrouping}
      manualSorting
      action={{
        header: "Acciones",
        cell({ original }) {
          return (
            <Link href={`/reportes/solicitudes/${original.id}`} passHref prefetch={true} title="Ver reserva">
              {/* TODO @Agustina: Considerar que puede haber reservas que sean laboratorio abierto */}
              <Button color={"outline"} className="h-8 w-8 px-1 py-1" variant={"icon"} icon={EyeIcon} />
            </Link>
          );
        },
      }}
    />
  );
};
