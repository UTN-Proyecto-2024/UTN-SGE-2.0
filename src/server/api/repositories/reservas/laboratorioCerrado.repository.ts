import type {
  inputAprobarReservaLaboratorioCerradoSchema,
  inputEditarReservaLaboratorioCerradoSchema,
  inputGetAllSolicitudesReservaLaboratorioCerrado,
  inputGetReservaLaboratorioPorId,
  inputGetReservaLaboratorioPorUsuarioId,
  inputRechazarReservaLaboratorioCerrado,
  inputReservaLaboratorioCerrado,
  inputReservaLaboratorioDiscrecional,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import { type PrismaClient, type Prisma, type CursoDia, ReservaEstatus } from "@prisma/client";
import type { z } from "zod";
import { informacionUsuario } from "../usuario-helper";
import { construirOrderByDinamico } from "@/shared/dynamic-orderby";
// import { lanzarErrorSiLaboratorioOcupado } from "./laboratorioEnUso.repository";
import { obtenerHoraInicioFin, armarFechaReserva, construirFechaReservaSinOffset } from "@/shared/get-date";

type InputGetPorUsuarioID = z.infer<typeof inputGetReservaLaboratorioPorUsuarioId>;
export const getReservaPorUsuarioId = async (ctx: { db: PrismaClient }, input: InputGetPorUsuarioID) => {
  const { id } = input;

  const filtrosWhereReservaLaboratorioCerrado: Prisma.ReservaLaboratorioCerradoWhereInput = {
    usuarioCreadorId: id,
  };

  const reservas = await ctx.db.reservaLaboratorioCerrado.findMany({
    where: filtrosWhereReservaLaboratorioCerrado,
    include: {
      reserva: true,
      laboratorio: true,
    },
    orderBy: {
      fechaCreacion: "desc",
    },
  });

  return reservas;
};

type InputGetPorId = z.infer<typeof inputGetReservaLaboratorioPorId>;
export const getReservaPorId = async (ctx: { db: PrismaClient }, input: InputGetPorId) => {
  const { id } = input;

  const reserva = await ctx.db.reservaLaboratorioCerrado.findUnique({
    where: {
      reservaId: id,
    },
    include: {
      sede: true,
      reserva: {
        include: {
          usuarioSolicito: {
            select: informacionUsuario,
          },
        },
      },
      laboratorio: true,
      curso: true,
      equipoReservado: {
        select: {
          equipoId: true,
          cantidad: true,
          equipoTipo: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
  });

  return reserva;
};

type InputGetAllReservas = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;
export const getAllReservas = async (ctx: { db: PrismaClient }, input: InputGetAllReservas, userId: string) => {
  const {
    pageIndex,
    pageSize,
    searchText,
    orderDirection,
    orderBy,
    estatus,
    filtrByUserId,
    pasadas,
    aprobadas,
    sede,
    turno,
    desde,
    hasta,
  } = input;

  const fechaHoyMenos1Dia = new Date();
  fechaHoyMenos1Dia.setHours(0, 0, 0, 0);
  const filtrosWhereReservaLaboratorioCerrado: Prisma.ReservaLaboratorioCerradoWhereInput = {
    ...(sede ? { sedeId: parseInt(sede) } : {}),
    ...(turno ? { curso: { turno: turno } } : {}),
    reserva: {
      ...(filtrByUserId === "true" ? { usuarioSolicitoId: userId } : {}),
      ...(estatus ? { estatus: estatus } : {}),
      ...(pasadas === "true" ? { fechaHoraFin: { lte: fechaHoyMenos1Dia } } : {}),
      ...(aprobadas === "true" ? { fechaHoraFin: { gte: fechaHoyMenos1Dia } } : {}),
      ...(desde ? { fechaHoraInicio: { gte: new Date(desde) } } : {}),
      ...(hasta ? { fechaHoraFin: { lte: new Date(hasta) } } : {}),
    },
    ...(searchText
      ? {
          OR: [
            {
              reserva: {
                reservaLaboratorioCerrado: {
                  laboratorio: {
                    nombre: {
                      contains: searchText ?? undefined,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
            {
              reserva: {
                reservaLaboratorioCerrado: {
                  curso: {
                    division: {
                      nombre: {
                        contains: searchText ?? undefined,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
            {
              reserva: {
                reservaLaboratorioCerrado: {
                  curso: {
                    materia: {
                      nombre: {
                        contains: searchText ?? undefined,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
            {
              reserva: {
                reservaLaboratorioCerrado: {
                  sede: {
                    nombre: {
                      contains: searchText ?? undefined,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const orden: Prisma.ReservaLaboratorioAbiertoOrderByWithRelationInput = construirOrderByDinamico(
    orderBy ?? "",
    orderDirection ?? "",
  );

  const [count, reservas] = await ctx.db.$transaction([
    ctx.db.reservaLaboratorioCerrado.count({
      where: filtrosWhereReservaLaboratorioCerrado,
    }),
    ctx.db.reservaLaboratorioCerrado.findMany({
      include: {
        curso: {
          include: {
            sede: true,
            division: true,
            materia: true,
            profesor: true,
          },
        },
        equipoReservado: true,
        sede: true,

        reserva: {
          include: {
            usuarioSolicito: {
              select: informacionUsuario,
            },
            usuarioAprobador: {
              select: informacionUsuario,
            },
            usuarioRenovo: {
              select: informacionUsuario,
            },
            usuarioRecibio: {
              select: informacionUsuario,
            },
          },
        },
        laboratorio: true,
      },
      where: filtrosWhereReservaLaboratorioCerrado,
      orderBy: orden,
      ...(pageIndex &&
        pageSize && {
          skip: parseInt(pageIndex) * parseInt(pageSize),
          take: parseInt(pageSize),
        }),
    }),
  ]);

  return {
    count,
    reservas,
  };
};

type InputAprobarReserva = z.infer<typeof inputAprobarReservaLaboratorioCerradoSchema>;
export const aprobarReserva = async (ctx: { db: PrismaClient }, input: InputAprobarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        include: {
          usuarioSolicito: true,
          usuarioAprobador: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue cancelada");
      }

      const laboratorioId = input.laboratorioId ? Number(input.laboratorioId) : undefined;

      // await lanzarErrorSiLaboratorioOcupado(
      //   { db: tx },
      //   {
      //     fechaHoraInicio: reserva.fechaHoraInicio,
      //     fechaHoraFin: reserva.fechaHoraFin,
      //     laboratorioId: laboratorioId,
      //     excepcionReservaId: reserva.id,
      //   },
      // );

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          estatus: "FINALIZADA",
          usuarioAprobadorId: userId,
          fechaAprobacion: new Date(),
          reservaLaboratorioCerrado: {
            update: {
              laboratorioId: laboratorioId ?? null,
              usuarioModificadorId: userId,
              equipoReservado: {
                deleteMany: {},
                createMany: {
                  data: input.equipoReservado.map((equipo) => ({
                    cantidad: equipo.cantidad,
                    equipoId: equipo.equipoId,
                    usuarioCreadorId: userId,
                    usuarioModificadorId: userId,
                  })),
                },
              },
            },
          },
        },
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error aprobando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputRechazarReserva = z.infer<typeof inputRechazarReservaLaboratorioCerrado>;
export const rechazarReserva = async (ctx: { db: PrismaClient }, input: InputRechazarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        include: {
          usuarioSolicito: true,
          usuarioAprobador: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "RECHAZADA" || reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue rechazada o cancelada");
      }

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        data: {
          estatus: "RECHAZADA",
          usuarioRechazadoId: userId,
          fechaRechazo: new Date(),
          motivoRechazo: input.motivo,
          reservaLaboratorioCerrado: {
            update: {
              usuarioModificadorId: userId,
              laboratorioId: null,
            },
          },
        },
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputEditarReserva = z.infer<typeof inputEditarReservaLaboratorioCerradoSchema>;
export const editarReserva = async (ctx: { db: PrismaClient }, input: InputEditarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        select: {
          usuarioCreadorId: true,
          usuarioSolicitoId: true,
          estatus: true,
          fechaHoraInicio: true,
          fechaHoraFin: true,
          reservaLaboratorioCerrado: {
            select: {
              curso: true,
              esDiscrecional: true,
              sedeId: true,
            },
          },
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === ReservaEstatus.CANCELADA) {
        throw new Error("La reserva ya fue cancelada");
      }

      await tx.reservaLaboratorioCerrado.delete({
        where: {
          reservaId: input.id,
        },
      });

      if (!reserva.reservaLaboratorioCerrado) {
        throw new Error("ReservaLaboratorioCerrado no encontrada");
      }

      const curso = {
        dia1: reserva.reservaLaboratorioCerrado.curso!.dia1,
        dia2: reserva.reservaLaboratorioCerrado.curso!.dia2,
        horaInicio1: reserva.reservaLaboratorioCerrado.curso!.horaInicio1,
        horaInicio2: reserva.reservaLaboratorioCerrado.curso!.horaInicio2,
        duracion1: reserva.reservaLaboratorioCerrado.curso!.duracion1,
        duracion2: reserva.reservaLaboratorioCerrado.curso!.duracion2,
        turno: reserva.reservaLaboratorioCerrado.curso!.turno,
      };
      const { fechaHoraInicio, fechaHoraFin } = obtenerFechaHoraInicio(curso, input);

      await tx.reserva.update({
        where: {
          id: input.id,
        },
        ...getReservaCerradaCreateArgs(
          input,
          userId,
          fechaHoraInicio,
          fechaHoraFin,
          reserva.reservaLaboratorioCerrado?.sedeId,
        ),
      });
      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

export const cancelarReserva = async (ctx: { db: PrismaClient }, input: InputRechazarReserva, userId: string) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: {
          id: input.id,
        },
        select: {
          usuarioCreadorId: true,
          usuarioSolicitoId: true,
          estatus: true,
        },
      });

      if (!reserva) {
        throw new Error("Reserva no encontrada");
      }

      if (reserva.estatus === "CANCELADA") {
        throw new Error("La reserva ya fue cancelada");
      }

      if (reserva.usuarioCreadorId === userId || reserva.usuarioSolicitoId === userId) {
        await tx.reserva.update({
          where: {
            id: input.id,
          },
          data: {
            estatus: "CANCELADA",
            usuarioModificadorId: userId,
            reservaLaboratorioCerrado: {
              update: {
                usuarioModificadorId: userId,
                laboratorioId: null,
              },
            },
          },
        });

        return reserva;
      }
      throw new Error("No tienes permisos para cancelar esta reserva");
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error rechazando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputCrearReserva = z.infer<typeof inputReservaLaboratorioCerrado>;
export const crearReservaLaboratorioCerrado = async (
  ctx: { db: PrismaClient },
  input: InputCrearReserva,
  userId: string,
) => {
  try {
    // Buscar el curso con los días y horas
    const curso = await ctx.db.curso.findUnique({
      where: { id: input.cursoId },
    });

    if (!curso) {
      throw new Error(`Curso no encontrado para el ID ${input.cursoId}`);
    }

    const { fechaHoraInicio, fechaHoraFin } = obtenerFechaHoraInicio(curso, input);

    // buscar reserva con misma fechaHoraInicio y fechaHoraFin. Si existe devolver error.
    const reservaExistente = await ctx.db.reservaLaboratorioCerrado.findFirst({
      where: {
        reserva: {
          fechaHoraInicio: fechaHoraInicio,
          fechaHoraFin: fechaHoraFin,
          estatus: {
            in: ["PENDIENTE", "FINALIZADA"],
          },
        },
        cursoId: input.cursoId,
      },
    });

    if (reservaExistente) {
      throw new Error(`Ya existe una reserva de laboratorio para el mismo curso en el rango de fechas seleccionado`);
    }

    // Crear la reserva
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.create({
        ...getReservaCerradaCreateArgs(input, userId, fechaHoraInicio, fechaHoraFin, curso.sedeId),
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error creando reserva. ${(error as Error).message ?? ""}`);
  }
};

type InputCrearReservaDiscrecional = z.infer<typeof inputReservaLaboratorioDiscrecional>;
export const crearReservaLaboratorioCerradoDiscrecional = async (
  ctx: {
    db: PrismaClient;
  },
  input: InputCrearReservaDiscrecional,
  userId: string,
) => {
  try {
    const reserva = await ctx.db.$transaction(async (tx) => {
      const reserva = await tx.reserva.create({
        data: {
          estatus: "FINALIZADA",
          tipo: "LABORATORIO_CERRADO",
          fechaHoraInicio: armarFechaReserva(input.fechaReserva, input.horaInicio),
          fechaHoraFin: armarFechaReserva(input.fechaReserva, input.horaFin),
          usuarioSolicitoId: userId,
          usuarioCreadorId: userId,
          usuarioModificadorId: userId,
          mostrarEnPantalla: input.agregarAPantalla,
          reservaLaboratorioCerrado: {
            create: {
              esDiscrecional: true,
              sedeId: Number(input.sedeId),
              cursoId: null,
              laboratorioId: Number(input.laboratorioId),
              requierePC: input.requierePc,
              requiereProyector: input.requiereProyector,
              descripcion: input.observaciones,
              equipoReservado: {
                createMany: {
                  data: input.equipoReservado.map((equipo) => ({
                    equipoId: equipo.equipoId,
                    usuarioCreadorId: userId,
                    usuarioModificadorId: userId,
                    cantidad: equipo.cantidad,
                  })),
                },
              },
              usuarioCreadorId: userId,
              usuarioModificadorId: userId,
            },
          },
        },
      });

      return reserva;
    });

    return reserva;
  } catch (error) {
    throw new Error(`Error creando reserva discrecional. ${(error as Error).message ?? ""}`);
  }
};

export const getReservaLaboratorioCerradoParaEmail = async (ctx: { db: PrismaClient }, input: { id: number }) => {
  const { id } = input;

  const datos = await ctx.db.reservaLaboratorioCerrado.findUnique({
    where: {
      reservaId: id,
    },
    include: {
      reserva: {
        include: {
          usuarioSolicito: {
            select: {
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      },
      laboratorio: true,
    },
  });

  const reserva = {
    laboratorioNombre: datos?.laboratorio?.nombre,
    usuarioSolicitante: {
      nombre: datos?.reserva.usuarioSolicito.nombre,
      apellido: datos?.reserva.usuarioSolicito.apellido,
      email: datos?.reserva.usuarioSolicito.email,
    },
  };

  return reserva;
};

const getReservaCerradaCreateArgs = (
  input: InputCrearReserva,
  userId: string,
  fechaHoraInicio?: Date,
  fechaHoraFin?: Date,
  sedeId?: number,
) => {
  return {
    data: {
      estatus: "PENDIENTE",
      tipo: "LABORATORIO_CERRADO",
      fechaHoraInicio: fechaHoraInicio,
      fechaHoraFin: fechaHoraFin,
      usuarioSolicitoId: userId,
      usuarioCreadorId: userId,
      usuarioModificadorId: userId,
      reservaLaboratorioCerrado: {
        create: {
          sedeId: sedeId,
          usuarioCreadorId: userId,
          usuarioModificadorId: userId,
          laboratorioId: null,
          cursoId: input.cursoId,
          requierePC: input.requierePc,
          requiereProyector: input.requiereProyector,
          descripcion: input.observaciones,
          equipoReservado: {
            createMany: {
              data: input.equipoReservado.map((equipo) => ({
                equipoId: equipo.equipoId,
                cantidad: equipo.cantidad,
                usuarioCreadorId: userId,
                usuarioModificadorId: userId,
              })),
            },
          },
        },
      },
    },
  } as Prisma.ReservaCreateArgs;
};

// Funcionalidades
// 1. Recibe un curso y una fecha
// 2. Valida que la fecha elegida sea alguno de los 2 posibles dias del curso
// 3. Toma el turno del curso
// 4. Devuelve la hora inicio y la hora fin para el dia del curso elegido
function obtenerFechaHoraInicio(
  curso: {
    dia1: string | null | undefined;
    dia2: string | null | undefined;
    horaInicio1: string;
    horaInicio2: string | null;
    duracion1: string;
    duracion2: string | null;
    turno: string;
  },
  input: InputCrearReserva,
) {
  // Obtener el día de la fecha de reserva
  const fechaReserva = construirFechaReservaSinOffset(input.fechaReserva);
  if (!(fechaReserva instanceof Date) || isNaN(fechaReserva.getTime())) {
    throw new Error("Fecha de reserva inválida");
  }
  const diaReserva = fechaReserva.getDay(); // Esto devolverá 0-6
  const diaReservaFinal = obtenerCursoDia(diaReserva);

  // Determinar si la reserva es para el dia1 o dia2 del curso
  let horaInicioStr: string | undefined;
  let duracionStr: string | undefined;

  if (diaReservaFinal === curso.dia1) {
    // Si el día de la reserva coincide con dia1
    horaInicioStr = curso.horaInicio1;
    duracionStr = curso.duracion1;
  } else if (diaReservaFinal === curso.dia2) {
    // Si el día de la reserva coincide con dia2
    horaInicioStr = curso.horaInicio2 ?? undefined;
    duracionStr = curso.duracion2 ?? undefined;
  }

  // Validar si el curso tiene clases ese día
  if (!horaInicioStr || !duracionStr) {
    throw new Error(`El curso no tiene clases el día ${diaReservaFinal}`);
  }

  const horaInicioNumero = parseInt(horaInicioStr);
  const duracionNumero = parseInt(duracionStr);
  const { horaInicio, horaFin } = obtenerHoraInicioFin(horaInicioNumero, curso.turno, duracionNumero);

  // Calcular las fechas finales basadas en la hora de inicio y duración
  const fechaHoraInicio = armarFechaReserva(input.fechaReserva, horaInicio);
  const fechaHoraFin = armarFechaReserva(input.fechaReserva, horaFin);

  return { fechaHoraInicio, fechaHoraFin };
}

// Función para obtener el día en formato CursoDia en base al día de la semana
function obtenerCursoDia(dia: number): CursoDia {
  const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
  return dias[dia] as CursoDia;
}
