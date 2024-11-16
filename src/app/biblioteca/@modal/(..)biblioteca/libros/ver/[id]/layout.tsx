import { estaLogueadoYConPermiso } from "@/server/permisos";
import { INICIO_ROUTE } from "@/shared/server-routes";
import { SgeNombre } from "@prisma/client";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function Layout({ children, modal }: LayoutProps) {
  const puedeVer = await estaLogueadoYConPermiso([
    SgeNombre.BIBLIOTECA_VER_DETALLES_LIBRO,
    SgeNombre.BIBLIOTECA_VER_LISTADO,
    SgeNombre.BIBLIOTECA_BUSCAR_LIBRO,
  ]);
  if (!puedeVer) {
    redirect(INICIO_ROUTE.href);
  }
  return (
    <div className="flex w-full flex-col">
      {children}
      {modal}
    </div>
  );
}
