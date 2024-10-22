"use client";

import { api } from "@/trpc/react";

export const useTienePermisos = (permisos: string[] = []) => {
  const esValido = Array.isArray(permisos) && permisos.length > 0;

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
      enabled: esValido,
    },
  );

  if (!esValido) {
    return {
      tienePermisos: true,
      isLoading: false,
      error: null,
    };
  }

  return {
    tienePermisos: tienePermisosResponse ?? false,
    isLoading,
    error,
  };
};
