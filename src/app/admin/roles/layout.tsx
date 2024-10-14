import { TienePermiso } from "@/app/biblioteca/tienePermiso";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function Layout({ children, modal }: LayoutProps) {
  return (
    <>
      <TienePermiso
        fallback={
          <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            No tenes permiso para ver esta pagina.
          </h3>
        }
      >
        <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Roles</h3>
        {children}
        {modal}
      </TienePermiso>
    </>
  );
}
