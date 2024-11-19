"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { ReservaViewAdmin } from "@/app/laboratorios/solicitudes/[id]/form-gestion-reserva";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PageProps = {
  params: { id: string };
};

export default function VerReservaModal({ params: { id } }: PageProps) {
  const [open, setOpen] = useState(true);

  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      router.back();
    }
  };

  const handleClickCancel = () => {
    router.back();
    setTimeout(() => {
      window.location.reload();
    }, 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  const handleClickAprobar = () => {
    router.back();
    setTimeout(() => {
      window.location.reload();
    }, 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  const handleClickRechazar = () => {
    router.back();
    setTimeout(() => {
      window.location.reload();
    }, 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  return (
    <ModalDrawer
      titulo="Detalle de Reserva"
      description="Detalles de la reserva de laboratorio."
      open={open}
      onOpenChange={handleOpenChange}
      className="max-h-[calc(100vh_-_10%)]"
    >
      <div className="flex max-h-max w-full flex-col gap-4">
        <ReservaViewAdmin
          reservaId={Number(id)}
          onCancel={handleClickCancel}
          onAprobar={handleClickAprobar}
          onRechazar={handleClickRechazar}
        />
      </div>
    </ModalDrawer>
  );
}
