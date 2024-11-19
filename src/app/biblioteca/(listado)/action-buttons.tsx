import { type z } from "zod";
import { BibliotecaFilterMateria } from "./filtros/biblioteca-filter-materia";
import { BibliotecaFilterText } from "./filtros/biblioteca-filter-text";

import { type inputGetBooks } from "@/shared/filters/biblioteca-filter.schema";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@prisma/client";

type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type ActionButtonsProps = {
  filters: BibliotecaFilters;
};

export const ActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row md:space-x-1.5 md:space-y-0">
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <TienePermiso permisos={[SgeNombre.BIBLIOTECA_BUSCAR_LIBRO]}>
            <BibliotecaFilterText filters={filters} />
          </TienePermiso>
        </div>
        <div className="md:basis-1/2">
          <TienePermiso permisos={[SgeNombre.BIBLIOTECA_BUSCAR_LIBRO]}>
            <BibliotecaFilterMateria filters={filters} />
          </TienePermiso>
        </div>
      </div>
    </div>
  );
};
