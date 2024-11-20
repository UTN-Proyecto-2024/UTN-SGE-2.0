"use client";

import { Button, DataTable } from "@/components/ui";
import type { RouterOutputs } from "@/trpc/react";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { getColumnasReservas } from "./_columnts";

type Reserva = RouterOutputs["reservas"]["reservasLaboratorio"]["getAll"][number];

export const ReservasHoy = async ({ reservas }: { reservas: Reserva[] }) => {
  const columns = getColumnasReservas();

  return (
    <DataTable
      data={reservas ?? []}
      columns={columns}
      manualSorting
      action={{
        header: "Acciones",
        cell({ original }) {
          return (
            <Link href={`/reportes/solicitudes/${original.id}`} passHref prefetch={false}>
              <Button color={"outline"} className="h-8 w-8 px-1 py-1" variant={"icon"} icon={EyeIcon} />
            </Link>
          );
        },
      }}
    />
  );
};
