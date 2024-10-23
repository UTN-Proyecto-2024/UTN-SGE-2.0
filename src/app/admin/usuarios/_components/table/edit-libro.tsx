import { Button } from "@/components/ui/button";
import { ADMIN_ROUTE } from "@/shared/server-routes";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditLibroModalProps = {
  usuarioId: string;
};

const rutaAdmin = ADMIN_ROUTE;

export const EditarUsuarioModal = (props: EditLibroModalProps) => {
  return (
    <Link key={props.usuarioId} href={`${rutaAdmin.href}/usuarios/${props.usuarioId}`} passHref prefetch={false}>
      <Button color={"outline"} className="h-8 w-8 px-1 py-1">
        <EditIcon size={16} />
      </Button>
    </Link>
  );
};
