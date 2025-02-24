"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { toast } from "@/components/ui";
import { api } from "@/trpc/react";
import ModalDrawer from "@/app/_components/modal/modal-drawer";

type RemoveMateriaModalProps = {
  materiaId: number;
  nombre?: string;
  onSubmit: () => void;
};

export default function RemoveMateriaModal({ materiaId, nombre, onSubmit }: RemoveMateriaModalProps) {
  const eliminarMateria = api.materia.eliminarMateria.useMutation({
    onSuccess: () => {
      toast.success(`La materia ${nombre} se eliminó con éxito.`);
      onSubmit?.();
    },
    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando la materia ${nombre}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleRemoveMateria = async (materiaId: number) => {
    eliminarMateria.mutate({ id: materiaId });
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button title="Eliminar materia" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
      }
      titulo={`Eliminar materia ${nombre ?? ""}`}
      cancelText="Cancelar"
      submitText="Sí, eliminar"
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={() => handleRemoveMateria(materiaId)}
      isAlertDialog
      esEliminar
    >
      <div>
        ¿Está seguro que desea eliminar <span className="font-bold">{nombre ?? "esta materia"}</span>?
      </div>
    </ModalDrawer>
  );
}
