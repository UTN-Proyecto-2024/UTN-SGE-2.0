import { estaLogueadoYConPermiso } from "@/server/permisos";
import { INICIO_ROUTE } from "@/shared/server-routes";
import { SgeNombre } from "@prisma/client";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const puedeVer = await estaLogueadoYConPermiso([SgeNombre.RES_LAB_CONFIRMAR_RESERVAS]);
  if (!puedeVer) {
    redirect(INICIO_ROUTE.href);
  }

  return (
    <>
      {/* <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Reserva</h3> */}
      <div className="flex flex-col items-center justify-center gap-6 px-4">{children}</div>
    </>
  );
}
