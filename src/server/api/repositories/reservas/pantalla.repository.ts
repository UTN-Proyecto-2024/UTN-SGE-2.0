import type {
  inputAgregarReservaPantalla,
  inputEliminarReservaPantallas,
  inputGetReservasEnPntallaActivas,
} from "@/shared/filters/reserva-pantalla-filter.schema";
import { armarFechaReserva, getDateISOString } from "@/shared/get-date";
import { ReservaEstatus, ReservaTipo, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

export const HelperReserva = {
  RESERVA: "RESERVA_LABORATORIO",
  PANTALLA: "PANTALLA",
};
type HelperReservaTipo = (typeof HelperReserva)[keyof typeof HelperReserva];

type ReservaEnPantalla = {
  id: string;
  materia: string | null;
  docente: string;
  laboratorio: string | null;
  fechaHoraInicio: Date;
  fechaHoraFin: Date;
  sede: string | null;
  tipo: HelperReservaTipo;
};

type InputGetReservasEnPntallaActivas = z.infer<typeof inputGetReservasEnPntallaActivas>;
export const getReservasEnPantalla = async (ctx: { db: PrismaClient }, input: InputGetReservasEnPntallaActivas) => {
  const { sedeId } = input;
  const sedeNumber = sedeId ? Number(sedeId) : undefined;
  const fechaHoy = new Date();
  const fechaHoyMas1Hora = new Date();
  fechaHoyMas1Hora.setHours(fechaHoyMas1Hora.getHours() + 1);

  // Puede ser discrecional y no tener curso asignado
  const reservasLaboratorioCerradoPromise = ctx.db.reserva.findMany({
    where: {
      estatus: ReservaEstatus.FINALIZADA,
      tipo: ReservaTipo.LABORATORIO_CERRADO,
      fechaHoraInicio: {
        lte: fechaHoyMas1Hora,
      },
      fechaHoraFin: {
        gte: fechaHoy,
      },
      mostrarEnPantalla: true,
      reservaLaboratorioCerrado: {
        // Si existe la sede buscamos cualquiera la tenga asignada, caso contrario cualquiera con laboratorio asignado alcanza
        ...(sedeId ? { laboratorio: { sedeId: sedeNumber } } : { laboratorioId: { not: null } }),
      },
    },
    select: {
      id: true,
      fechaHoraInicio: true,
      fechaHoraFin: true,
      reservaLaboratorioCerrado: {
        select: {
          curso: {
            select: {
              id: true,
              materia: {
                select: {
                  nombre: true,
                },
              },
              profesor: {
                select: {
                  nombre: true,
                  apellido: true,
                },
              },
            },
          },
          laboratorio: {
            select: {
              nombre: true,
            },
          },
          sede: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
  });

  const pantallasActivasPromise = ctx.db.pantalla.findMany({
    where: {
      fechaHoraInicio: {
        lte: fechaHoyMas1Hora,
      },
      fechaHoraFin: {
        gte: fechaHoy,
      },
      sedeId: sedeId ? { equals: sedeNumber } : undefined,
    },
    select: {
      id: true,
      docente: true,
      materia: true,
      laboratorio: true,
      fechaHoraInicio: true,
      fechaHoraFin: true,
      sede: true,
    },
  });

  const [reservasLaboratorio, reservasPantalla] = await Promise.all([
    reservasLaboratorioCerradoPromise,
    pantallasActivasPromise,
  ]);

  const reservaLaboratorioComoPantalla: ReservaEnPantalla[] = reservasLaboratorio.map((reserva) => {
    const reservaLaboratorioCerrado = reserva.reservaLaboratorioCerrado;
    const curso = reservaLaboratorioCerrado?.curso ?? null;

    const docenteNombre = curso?.profesor.nombre ?? "";
    const docenteApellido = curso?.profesor.apellido ?? "";

    const materia = curso?.materia.nombre ?? "";

    const laboratorio = reservaLaboratorioCerrado?.laboratorio?.nombre ?? "";

    return {
      id: `${HelperReserva.RESERVA}_${reserva.id}`,
      docente: docenteNombre + " " + docenteApellido,
      materia: materia,
      laboratorio: laboratorio,
      fechaHoraInicio: reserva.fechaHoraInicio,
      fechaHoraFin: reserva.fechaHoraFin,
      sede: reservaLaboratorioCerrado?.sede?.nombre ?? "",
      tipo: HelperReserva.RESERVA,
    };
  });

  const reservasPantallaMap = reservasPantalla.map((reservaPantalla) => {
    return {
      ...reservaPantalla,
      id: `${HelperReserva.PANTALLA}_${reservaPantalla.id}`,
      sede: reservaPantalla.sede.nombre ?? "",
      tipo: HelperReserva.PANTALLA,
    };
  });

  const reservasParaPantalla: ReservaEnPantalla[] = [...reservaLaboratorioComoPantalla, ...reservasPantallaMap];

  return reservasParaPantalla;
};

type InputEliminarReservaPantalla = z.infer<typeof inputEliminarReservaPantallas>;
export const removerReservaPantalla = async (ctx: { db: PrismaClient }, input: InputEliminarReservaPantalla) => {
  const { ids } = input;

  const reservaABorrarPromise = ids.map((id) => {
    const reserva = id.split("_");

    if (reserva[0] === HelperReserva.RESERVA) {
      return ctx.db.reserva.update({
        data: {
          mostrarEnPantalla: false,
        },
        where: {
          id: Number(reserva[1]),
        },
      });
    }

    if (reserva[0] === HelperReserva.PANTALLA) {
      return ctx.db.pantalla.delete({
        where: {
          id: Number(reserva[1]),
        },
      });
    }
  });

  await Promise.all(reservaABorrarPromise);

  return;
};

type InputCrearReservaPantalla = z.infer<typeof inputAgregarReservaPantalla>;
export const crearReservaPantalla = async (
  ctx: { db: PrismaClient },
  input: InputCrearReservaPantalla,
  userId: string,
) => {
  const hoy = getDateISOString(new Date());

  const { docente, materia, laboratorio, horaInicio, horaFin, sedeId } = input;

  const fechaHoraInicio = armarFechaReserva(hoy, horaInicio);
  const fechaHoraFin = armarFechaReserva(hoy, horaFin);

  console.log({ horaInicio, horaFin, fechaHoraInicio, fechaHoraFin });

  const reservaPantallaCreada = await ctx.db.pantalla.create({
    data: {
      docente,
      materia,
      laboratorio,
      fechaHoraInicio,
      fechaHoraFin,
      sedeId: Number(sedeId),

      usuarioCreadorId: userId,
    },
  });

  return reservaPantallaCreada;
};
