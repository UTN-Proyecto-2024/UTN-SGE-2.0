"use client";

import { DataTable } from "@/components/ui";
import { type RouterOutputs } from "@/trpc/react";
import { ReservarLaboratorioCerradoModal } from "./reservar-laboratorio";
import { getColumns } from "./columns";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

type CursoData = RouterOutputs["cursos"]["getAll"];

type CursosTableProps = {
  data: CursoData;
};

export const CursosTable = ({ data }: CursosTableProps) => {
  const columns = getColumns();

  return (
    <>
      <DataTable
        data={data.cursos ?? []}
        columns={columns}
        action={{
          header: "Acciones",
          cell({ original }) {
            return (
              <>
                <TienePermiso
                  permisos={[SgeNombre.RES_LAB_RESERVAR_CURSO_AUTO, SgeNombre.RES_LAB_RESERVAR_CATEDRA_AUTO]}
                >
                  <ReservarLaboratorioCerradoModal cursoId={original.id} />
                </TienePermiso>
              </>
            );
          },
        }}
      />
    </>
  );
};
