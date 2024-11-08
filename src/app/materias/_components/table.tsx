"use client";

import { DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { getColumns } from "./columns";
import RemoveMateriaModal from "./remove-materia";
import EditMateriaModal from "./edit-materia";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { GroupingState } from "@tanstack/react-table";

type MateriaData = RouterOutputs["materia"]["getAll"];

type MateriasTableProps = {
  data: MateriaData;
};

export const MateriasTable = ({ data }: MateriasTableProps) => {
  const columns = getColumns();
  const router = useRouter();
  const [grouping, setGrouping] = useState<GroupingState>(["anio"]);

  const onDeleteMateria = () => {
    router.refresh();
  };

  return (
    <>
      <DataTable
        data={data ?? []}
        columns={columns}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <RemoveMateriaModal materiaId={original.id} nombre={original.nombre} onSubmit={onDeleteMateria} />
                <EditMateriaModal materiaId={original.id.toString()} /> {/* Modal para editar */}
              </>
            );
          },
        }}
        grouping={grouping}
        setGrouping={setGrouping}
      />
    </>
  );
};

export default MateriasTable;
