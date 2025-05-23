import { api, type RouterInputs } from "@/trpc/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTimeISOString } from "@/shared/get-date";
import Link from "next/link";
import { CalendarOffIcon } from "lucide-react";
import { LABORATORIO_ABIERTO_ROUTE, LABORATORIO_ROUTE } from "@/shared/server-routes";
import { ReservaTipo } from "@/generated/prisma";

type Props = RouterInputs["reservas"]["laboratorioEnUso"]["obtenerReservasExistentesDeLaboratorio"];

const RUTA_RESERVA_ABIERTO = LABORATORIO_ABIERTO_ROUTE?.subRutas?.[1]?.href ?? "";
const RUTA_RESERVA_CERRADO = LABORATORIO_ROUTE?.subRutas?.[5]?.href ?? "";

export const LaboratorioOcupado = (props: Props) => {
  const isValidQuery =
    props.laboratorioId !== undefined && props.fechaHoraInicio !== undefined && props.fechaHoraFin !== undefined;

  const {
    data: reservasExistentes,
    isLoading,
    isError,
  } = api.reservas.laboratorioEnUso.obtenerReservasExistentesDeLaboratorio.useQuery(
    { ...props },
    { enabled: isValidQuery },
  );

  const reservaInterfiere = reservasExistentes && reservasExistentes.length ? reservasExistentes[0] : null;

  if (!isValidQuery) {
    return null;
  }

  if (isError) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (!reservaInterfiere) {
    return null;
  }

  return (
    <Alert variant={"warn"} className="mt-2 w-full">
      <AlertTitle className="flex flex-row">
        <CalendarOffIcon className="mr-2 h-4 w-4" />
        El laboratorio ya está ocupado
      </AlertTitle>
      <AlertDescription>
        <p className="text-sm">
          El laboratorio elegido está ocupado en el horario de{" "}
          <b>{getTimeISOString(reservaInterfiere.fechaHoraInicio)}</b> a{" "}
          <b>{getTimeISOString(reservaInterfiere.fechaHoraFin)}</b> por la reserva <b>#{reservaInterfiere.id}</b>
        </p>
        <Link
          href={`${reservaInterfiere.tipo === ReservaTipo.LABORATORIO_ABIERTO ? RUTA_RESERVA_ABIERTO : RUTA_RESERVA_CERRADO}/${reservaInterfiere.id}`}
          passHref
          className="text-primary hover:underline"
        >
          Click aquí para verla
        </Link>
      </AlertDescription>
    </Alert>
  );
};
