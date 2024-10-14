"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

export const useTienePermisos = () => {
  const [tienePermisos, setTienePermisos] = useState<boolean>(false);

  const { data: tienePermisosResponse } = api.permisos.usuarioTienePermisos.useQuery();

  useEffect(() => {
    if (tienePermisosResponse !== undefined) {
      setTienePermisos(tienePermisosResponse);
    }
  }, [tienePermisosResponse]);

  return tienePermisos;
};
