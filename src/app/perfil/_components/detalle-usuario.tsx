import { type RouterOutputs } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, IndentIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { BadgeRol } from "@/app/_components/badge-rol";
import { getFechaHumanoDDMMYYYY } from "@/shared/get-date";

type UsuarioData = RouterOutputs["admin"]["usuarios"]["getUsuarioPorId"];
type DetalleContenedor = {
  usuarioData: UsuarioData;
};

function DetalleUsuario({ usuarioData }: DetalleContenedor) {
  if (!usuarioData) {
    return <div>Usuario no encontrado</div>;
  }

  const {
    nombre,
    legajo,
    apellido,
    email,
    direccion,
    telefonoCasa,
    telefonoCelular,
    telefonoLaboral,
    documentoNumero,
    fechaNacimiento,
    usuarioRol,
    image,
  } = usuarioData;

  return (
    <div className="container mx-auto space-y-8">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={image ?? ""} alt={`${nombre} ${apellido}`} />
              <AvatarFallback>
                {nombre?.[0] ?? ""}
                {apellido?.[0] ?? ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <CardTitle className="mb-1 text-2xl">
                {nombre} {apellido}
              </CardTitle>
              <p className="mb-1 ">{email}</p>
              <p className="mb-2 text-sm ">Legajo: {legajo ?? "-"}</p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {usuarioRol.map((rol) => (
                  <BadgeRol nombre={rol.rol.nombre} key={rol.rolId} />
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center font-semibold">
                <PhoneIcon className="mr-2 h-4 w-4" />
                Teléfonos
              </Label>
              <p>Casa: {telefonoCasa}</p>
              <p>Celular: {telefonoCelular}</p>
              <p>Laboral: {telefonoLaboral}</p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center font-semibold">
                <MapPinIcon className="mr-2 h-4 w-4" />
                Dirección
              </Label>
              <p>{direccion}</p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center font-semibold">
                <IndentIcon className="mr-2 h-4 w-4" />
                Documento
              </Label>
              <p>{documentoNumero}</p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center font-semibold">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Fecha de Nacimiento
              </Label>
              <p>{getFechaHumanoDDMMYYYY(fechaNacimiento)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DetalleUsuario;
