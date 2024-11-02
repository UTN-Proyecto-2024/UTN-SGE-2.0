import { Button } from "@/components/ui";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type EditCursoModalProps = {
  cursoId: number;
};

export const ReservarLaboratorioCerradoModal = (props: EditCursoModalProps) => {
  const pathname = usePathname();

  return (
    <Link key={props.cursoId} href={`${pathname}/${props.cursoId}`} passHref prefetch={true} title="Reservar curso">
      <Button type="button" color={"outline"} className="" variant={"default"} icon={CalendarCheck}>
        <div className="flex flex-row gap-x-2 ">reservar</div>{" "}
      </Button>
    </Link>
  );
};
