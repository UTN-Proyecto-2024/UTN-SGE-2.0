"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { ReservaViewAdmin } from "@/app/laboratorio_abierto/solicitudes/[id]/form-gestion-reserva";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PageProps = {
  params: { id: string };
};

export default function VerReservaModal({ params: { id } }: PageProps) {
  const [open, setOpen] = useState(true);
  const utils = api.useUtils();
  const refreshGetAll = () => {
    utils.reservas.reservaLaboratorioAbierto.getAll.invalidate().catch((err) => {
      console.error(err);
    });
  };

  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      router.back();
    }
  };

  const handleClickCancel = () => {
    handleOpenChange(false);
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
      description="Detalles de la reserva de laboratorio abierto."
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<></>}
      className="max-h-[calc(100vh_-_10%)]"
    >
      <ReservaViewAdmin
        reservaId={Number(id)}
        onCancel={handleClickCancel}
        onAprobar={handleClickAprobar}
        onRechazar={handleClickRechazar}
      />
    </ModalDrawer>
  );
}
