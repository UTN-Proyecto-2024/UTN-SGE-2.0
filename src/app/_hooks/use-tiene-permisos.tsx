"use client";

import { type SgeNombre } from "@prisma/client";
import { usePermisos } from "./use-context-tiene-permisos";

export const useTienePermisos = (permisos: SgeNombre[] = []) => {
  const { permisos: tienePermisosResponse, isLoading, isError } = usePermisos();

  if (isError) {
    return {
      tienePermisos: false,
      isLoading: false,
      isError: true,
    };
  }

  if (isLoading) {
    return {
      tienePermisos: false,
      isLoading: true,
      isError: false,
    };
  }

  const tieneAlguno = permisos.some((permiso) => tienePermisosResponse[permiso]);

  return {
    tienePermisos: tieneAlguno,
    isLoading: false,
    isError: false,
  };
};
