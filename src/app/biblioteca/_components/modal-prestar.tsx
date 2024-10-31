"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LibroInformacionBasica } from "../libros/_components/info-basica-libro";
import { Separator } from "@radix-ui/react-separator";
import { LibroFormPrestarORenovar } from "./form-prestar";
import { api } from "@/trpc/react";
import { PrestarButton } from "@/app/_components/prestar-devolver";

type PrestarLibroModalProps = {
  libroId: number;
};

export default function PrestarLibroModal({ libroId }: PrestarLibroModalProps) {
  const [open, setOpen] = useState(false);

  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId }, { enabled: open });

  const handleSubmit = () => setOpen(false);
  const handleCancel = () => setOpen(false);

  if (isError) {
    return <div>Error al cargar información del libro...</div>;
  }

  return (
    <ModalDrawer
      trigger={
        <span>
          <PrestarButton />
        </span>
      }
      titulo={`Prestar libro`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-col">
        <ScrollArea className="max-h-72">
          <LibroInformacionBasica libroId={libroId} />
        </ScrollArea>

        <Separator className="my-8 border-2" />

        {!isLoading && libro && (
          <LibroFormPrestarORenovar libroId={libroId} onCancel={handleCancel} onSubmit={handleSubmit} />
        )}
      </div>
    </ModalDrawer>
  );
}
