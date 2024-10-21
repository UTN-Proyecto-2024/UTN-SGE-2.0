import { Button } from "@/components/ui/button";
import { ADMIN_ROUTE } from "@/shared/server-routes";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditarLaboratorioModalProps = {
  laboratorioId: number;
};

const rutaAdmin = ADMIN_ROUTE;

export const EditarLaboratorioModal = ({ laboratorioId }: EditarLaboratorioModalProps) => {
  return (
    <Link key={laboratorioId} href={`${rutaAdmin.href}/laboratorios/${laboratorioId}`} passHref prefetch={false}>
      <Button color={"outline"} className="h-8 w-8 px-1 py-1">
        <EditIcon size={16} />
      </Button>
    </Link>
  );
};
