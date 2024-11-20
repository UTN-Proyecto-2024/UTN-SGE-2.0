import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";

const rutaBiblioteca = BIBLIOTECA_ROUTE.subRutas !== undefined ? BIBLIOTECA_ROUTE?.subRutas[1] : undefined;
const rutaMisPrestamos = BIBLIOTECA_ROUTE.subRutas !== undefined ? BIBLIOTECA_ROUTE?.subRutas[2] : undefined;

export const ActionRedirect = () => {
  return (
    <>
      <Button color={"ghost"}>
        <Link href={rutaBiblioteca?.href ?? "/"} passHref>
          Ir a préstamos
        </Link>
      </Button>
      <Button color={"ghost"}>
        <Link href={rutaMisPrestamos?.href ?? "/"} passHref>
          Ir a mis préstamos
        </Link>
      </Button>
    </>
  );
};
