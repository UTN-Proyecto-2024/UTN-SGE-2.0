import { Button } from "@/components/ui/button";
import { CURSOS_ROUTE } from "@/shared/server-routes";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditCursoModalProps = {
  cursoId: number;
};

const rutaCurso = CURSOS_ROUTE;

export const EditCursoModal = (props: EditCursoModalProps) => {
  return (
    <Link key={props.cursoId} href={`${rutaCurso.href}/curso/${props.cursoId}`} passHref prefetch={false}>
      <Button color={"outline"} className="h-8 w-8 px-1 py-1">
        <EditIcon size={16} />
      </Button>
    </Link>
  );
};
