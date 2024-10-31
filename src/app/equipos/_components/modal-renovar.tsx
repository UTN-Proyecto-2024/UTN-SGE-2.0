"use client";

import { useState } from "react";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { Separator } from "@radix-ui/react-separator";
import { EquipoFormPrestarORenovar } from "./form-prestar";
import { EquipoInformacionBasica } from "../equipo/_components/info-basica-equipo";
import { RenovarButton } from "@/app/_components/prestar-devolver";

type RenovarPrestamoEquipoModalProps = {
  equipoId: number;
};

export default function RenovarPrestamoEquipoModal({ equipoId }: RenovarPrestamoEquipoModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => setOpen(false);

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <span>
          <RenovarButton />
        </span>
      }
      titulo={`Renovar equipo`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-col">
        <EquipoInformacionBasica equipoId={equipoId} />

        <Separator className="my-8 border-2" />

        <EquipoFormPrestarORenovar equipoId={equipoId} onCancel={handleCancel} onSubmit={handleSubmit} renovar />
      </div>
    </ModalDrawer>
  );
}
