"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { CursoForm } from "../curso/[id]/curso-form";
import { useState } from "react";

export const CursosNuevoCurso = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleSave = () => {
    router.refresh();
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Nuevo curso"}
      description={"Creá un nuevo curso"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button color={"primary"}>
          Nuevo curso
          <Plus size={16} className="ml-2" />
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <CursoForm onCancel={handleCancel} onSubmit={handleSave} />
    </ModalDrawer>
  );
};
