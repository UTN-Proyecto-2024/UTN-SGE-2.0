"use client";

import { useTienePermisos } from "@/app/_hooks/use-tiene-permisos";

type TienePermisoProps = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export const TienePermiso = ({ fallback = null, children }: TienePermisoProps) => {
  const tienePermiso = useTienePermisos();

  return tienePermiso ? <>{children}</> : <>{fallback}</>;
};
