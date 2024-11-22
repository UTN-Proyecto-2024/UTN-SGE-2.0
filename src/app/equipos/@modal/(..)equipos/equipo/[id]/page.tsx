"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { EquipoForm } from "@/app/equipos/equipo/[id]/equipo-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScrollArea } from "@/components/ui";

type PageProps = {
  params: { id: string };
};

export default function PageDetails({ params: { id } }: PageProps) {
  const [open, setOpen] = useState(true);

  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      router.back();
    }
  };

  const handleClickSave = () => {
    router.back();
    setTimeout(() => router.refresh(), 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  const handleClickCancel = () => handleOpenChange(false);

  return (
    <ModalDrawer
      titulo={"Editar equipo"}
      description={"Esta es la página de edición del equipo."}
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<></>}
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <ScrollArea className="mt-4 max-h-[calc(100vh_-_300px)] w-full pr-4">
          <EquipoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
        </ScrollArea>
      </div>
    </ModalDrawer>
  );
}
