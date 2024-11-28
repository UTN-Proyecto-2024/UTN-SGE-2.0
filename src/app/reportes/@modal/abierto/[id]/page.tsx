"use client";

import { useRouter } from "next/navigation";
import { ReservaViewAdmin } from "@/app/laboratorio_abierto/solicitudes/[id]/form-gestion-reserva";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { useState } from "react";
import { api } from "@/trpc/react";
import { ScrollArea } from "@/components/ui";

type PageProps = {
  params: { id: string };
};

export default function PageDetalleReserva({ params: { id } }: PageProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const utils = api.useUtils();
  const refreshGetAll = () => {
    utils.reservas.reservasLaboratorio.getAll.invalidate().catch((err) => {
      console.error(err);
    });
    utils.laboratorios.getAll.invalidate().catch((err) => {
      console.error(err);
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      router.back();
    }
  };

  const handleClickCancel = () => {
    refreshGetAll();
    router.back();
  };

  const handleClickAprobar = () => {
    refreshGetAll();
    router.back();
  };

  const handleClickRechazar = () => {
    refreshGetAll();
    router.back();
  };

  return (
    <ModalDrawer
      titulo="Detalle de Reserva"
      description="Detalles de la reserva de laboratorio."
      open={open}
      onOpenChange={handleOpenChange}
      className="max-h-[calc(100vh_-_300px)]"
    >
      <div className="flex max-h-max w-full flex-col gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_300px)]">
          <ReservaViewAdmin
            reservaId={Number(id)}
            onCancel={handleClickCancel}
            onAprobar={handleClickAprobar}
            onRechazar={handleClickRechazar}
          />
        </ScrollArea>
      </div>
    </ModalDrawer>
  );
}
