"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LibroForm } from "../libros/[id]/libro-form";
import { useState } from "react";
import { SgeNombre } from "@prisma/client";
import { useTienePermisos } from "@/app/_hooks/use-tiene-permisos";

export const BibliotecaNewLibro = () => {
  const tienePermiso = useTienePermisos([SgeNombre.BIBLIOTECA_ABM_LIBRO]);

  const [open, setOpen] = useState(false);

  const router = useRouter();

  if (!tienePermiso) return null;

  const handleSave = () => {
    router.refresh();
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Nuevo libro"}
      description={"Creá un nuevo libro"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button color={"primary"}>
          Nuevo libro
          <Plus size={16} className="ml-2" />
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <LibroForm onCancel={handleCancel} onSubmit={handleSave} />
      </div>
    </ModalDrawer>
  );
};
