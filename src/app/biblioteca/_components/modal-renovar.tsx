"use client";

import { useState } from "react";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LibroInformacionBasica } from "../libros/_components/info-basica-libro";
import { Separator } from "@radix-ui/react-separator";
import { LibroFormPrestarORenovar } from "./form-prestar";
import { RenovarButton } from "@/app/_components/prestar-devolver";
import { ScrollArea } from "@/components/ui";

type RenovarPrestamoLibroModalProps = {
  libroId: number;
};

export default function RenovarPrestamoLibroModal({ libroId }: RenovarPrestamoLibroModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => setOpen(false);

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <div className="flex flex-row justify-center">
          <RenovarButton />
        </div>
      }
      titulo={`Renovar libro`}
      open={open}
      onOpenChange={setOpen}
    >
      <ScrollArea className="max-h-[calc(100vh_-_300px)] w-full pr-4">
        <div className="flex h-auto w-full flex-col">
          <LibroInformacionBasica libroId={libroId} />

          <Separator className="my-8 border-2" />

          <LibroFormPrestarORenovar libroId={libroId} onCancel={handleCancel} onSubmit={handleSubmit} renovar />
        </div>
      </ScrollArea>
    </ModalDrawer>
  );
}
