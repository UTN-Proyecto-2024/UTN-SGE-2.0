"use server";

import { redirect } from "next/navigation";
import { INICIO_ROUTE } from "@/shared/server-routes";
import { estaLogueadoYConPermiso } from "@/server/permisos";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function RootLayout({ children, modal }: LayoutProps) {
  const puedeEstarAca = await estaLogueadoYConPermiso([]);

  if (!puedeEstarAca) {
    redirect(INICIO_ROUTE.href);
    return null;
  }

  return (
    <main className="flex flex-col">
      {children}
      {modal}
    </main>
  );
}
