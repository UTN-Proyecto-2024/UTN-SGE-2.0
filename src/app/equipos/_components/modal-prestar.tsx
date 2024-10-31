"use client";

import { useState } from "react";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { Separator } from "@radix-ui/react-separator";
import { EquipoInformacionBasica } from "../equipo/_components/info-basica-equipo";
import { EquipoFormPrestarORenovar } from "./form-prestar";
import { PrestarButton } from "@/app/_components/prestar-devolver";

type PrestarEquipoModalProps = {
  equipoId: number;
};

export default function PrestarEquipoModal({ equipoId }: PrestarEquipoModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => setOpen(false);
  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <span>
          <PrestarButton />
        </span>
      }
      titulo={`Prestar Equipo`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex h-auto w-full flex-col">
        <EquipoInformacionBasica equipoId={equipoId} />

        <Separator className="my-8 border-2" />

        <EquipoFormPrestarORenovar equipoId={equipoId} onCancel={handleCancel} onSubmit={handleSubmit} />
      </div>
    </ModalDrawer>
  );
}
