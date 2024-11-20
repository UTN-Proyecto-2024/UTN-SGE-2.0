"use server";

import { estaLogueadoYConPermiso } from "@/server/permisos";
import { INICIO_ROUTE } from "@/shared/server-routes";
import { SgeNombre } from "@prisma/client";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function RootLayout({ children, modal }: LayoutProps) {
  const puedeVer = await estaLogueadoYConPermiso([SgeNombre.ADMIN_VER_PANEL_ADMIN]);
  if (!puedeVer) {
    redirect(INICIO_ROUTE.href);
  }

  return (
    <>
      {children}
      {modal}
    </>
  );
}
