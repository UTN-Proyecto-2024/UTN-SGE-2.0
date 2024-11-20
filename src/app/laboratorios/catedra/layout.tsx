"use server";

import { estaLogueadoYConPermiso } from "@/server/permisos";
import { INICIO_ROUTE } from "@/shared/server-routes";
import { SgeNombre } from "@prisma/client";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function Layout({ children, modal }: LayoutProps) {
  const puedeVer = await estaLogueadoYConPermiso([SgeNombre.RES_LAB_VER_RESERVAS_CATEDRA]);
  if (!puedeVer) {
    redirect(INICIO_ROUTE.href);
  }

  return (
    <main className="flex flex-col">
      {children}
      {modal}
    </main>
  );
}
