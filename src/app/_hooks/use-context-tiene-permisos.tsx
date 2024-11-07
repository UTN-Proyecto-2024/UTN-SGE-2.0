"use client";

// context/PermisosContext.tsx
import React, { createContext, useContext, useMemo } from "react";
import { api } from "@/trpc/react";
import { type SgeNombre } from "@prisma/client";
import { type Session } from "next-auth";

interface PermisosContextProps {
  permisos: Record<SgeNombre, boolean>;
  isLoading: boolean;
  isError: boolean;
}

const PermisosContext = createContext<PermisosContextProps>({
  permisos: {} as Record<SgeNombre, boolean>,
  isLoading: true,
  isError: false,
});

export const PermisosProvider: React.FC<{ children: React.ReactNode; session?: Session | null }> = ({
  children,
  session,
}) => {
  const { data, isLoading, isError } = api.permisos.getPermisosUsuario.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: session !== null,
  });

  const permisos = useMemo(() => {
    if (!data) return {} as Record<SgeNombre, boolean>;

    return data.reduce(
      (acc, sgeNombre) => {
        acc[sgeNombre] = true;

        return acc;
      },
      {} as Record<SgeNombre, boolean>,
    );
  }, [data]);

  return <PermisosContext.Provider value={{ permisos, isLoading, isError }}>{children}</PermisosContext.Provider>;
};

export const usePermisos = () => useContext(PermisosContext);
