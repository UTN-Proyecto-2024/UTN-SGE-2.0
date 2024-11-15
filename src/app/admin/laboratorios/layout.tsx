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
    SgeNombre.ADMIN_MODIFICAR_ATRIBUTOS_ADMIN,
    SgeNombre.ADMIN_MODIFICAR_ATRIBUTOS,
    SgeNombre.ADMIN_AGREGAR_USUARIOS_A_GRUPOS,
    SgeNombre.ADMIN_VER_FICHA_USUARIO,
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
