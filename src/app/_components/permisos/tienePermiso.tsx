"use client";

import { useTienePermisos } from "@/app/_hooks/use-tiene-permisos";
import { type SgeNombre } from "@prisma/client";

type TienePermisoProps = {
  permisos: SgeNombre[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export const TienePermiso = ({ permisos, fallback = null, children }: TienePermisoProps) => {
  const { tienePermisos, isLoading, isError } = useTienePermisos(permisos);

  if (isLoading) {
    return null;
  }

  if (isError) {
    return null;
  }

  return tienePermisos ? <>{children}</> : <>{fallback}</>;
};
