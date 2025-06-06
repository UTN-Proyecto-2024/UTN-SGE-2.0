import { AlertCircleIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/components/utils";
import { type ReservaLaboratorioAbiertoType } from "./constants";
import { ReservarLaboratorioAbiertoModal } from "../table/reservar-laboratorio-abierto";
import { TienePermiso } from "@/app/_components/permisos/tienePermiso";
import { SgeNombre } from "@/generated/prisma";

type CardProps = React.ComponentProps<typeof Card>;

type LaboratorioAbiertoType = {
  laboratorio: ReservaLaboratorioAbiertoType;
};

export function LaboratorioCard({ className, ...props }: CardProps & LaboratorioAbiertoType) {
  const { laboratorio } = props;
  const { titulo, descripcion, alerta, contenido } = laboratorio ?? {};

  return (
    <Card
      className={cn("flex flex-col justify-between text-center hover:border-primary/50 hover:bg-slate-100", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="py-4">{titulo}</CardTitle>
        {descripcion.map((descripcion, index) => (
          <CardDescription key={index}>{descripcion}</CardDescription>
        ))}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-left" dangerouslySetInnerHTML={{ __html: contenido ?? "" }} />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {alerta && <AlertaLaboratorio alerta={alerta} />}

        <TienePermiso permisos={[SgeNombre.LAB_ABIERTO_RESERVAR]}>
          <ReservarLaboratorioAbiertoModal tipo={laboratorio.tipo} />
        </TienePermiso>
      </CardFooter>
    </Card>
  );
}

const AlertaLaboratorio = ({ alerta }: { alerta: string }) => {
  return (
    <div className=" border-warn flex items-center space-x-4 rounded-md border p-4">
      <AlertCircleIcon />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none underline">Importante</p>
        <p className="text-sm">{alerta}</p>
      </div>
    </div>
  );
};
