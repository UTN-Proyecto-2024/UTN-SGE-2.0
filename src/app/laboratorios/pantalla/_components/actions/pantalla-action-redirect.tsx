import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import { AgregarAPantallaModal } from "./software-nuevo";

const rutaCurso = LABORATORIO_ROUTE;
const subrutasCurso = rutaCurso?.subRutas ?? [];

export const PantallaActionRedirect = () => {
  return (
    <>
      <AgregarAPantallaModal />
      {subrutasCurso.map((subRuta, index) => (
        <Link key={index} href={subRuta.href} passHref>
          <Button color={"ghost"}>{subRuta.label}</Button>
        </Link>
      ))}
    </>
  );
};