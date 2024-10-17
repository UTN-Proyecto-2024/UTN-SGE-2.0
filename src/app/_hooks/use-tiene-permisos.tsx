"use client";

import { api } from "@/trpc/react";

export const useTienePermisos = (permisos: string[]) => {
  const {
    data: tienePermisosResponse,
    isLoading,
    error,
  } = api.permisos.usuarioTienePermisos.useQuery(
    {
      permisos,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  return {
    tienePermisos: tienePermisosResponse ?? false,
    isLoading,
    error,
  };
};
