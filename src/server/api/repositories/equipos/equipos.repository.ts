import {
  type inputEditarEquipos,
  type inputEliminarEquipo,
  type inputAgregarEquipo,
  type inputGetEquipo,
  type inputGetEquipos,
  type inputGetArmarios,
  type inputAgregarMarca,
} from "@/shared/filters/equipos-filter.schema";
import { Prisma, type PrismaClient } from "@/generated/prisma";
import { type z } from "zod";
import { generarEquipoInventarioId, getUltimoEquipoInventarioId } from "./generador-inventario-id";
import { construirOrderByDinamico } from "@/shared/dynamic-orderby";

type InputGetAll = z.infer<typeof inputGetEquipos>;
export const getAllEquipos = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { pageIndex, pageSize, searchText, sede, laboratorio, tipo, armario } = input;

  const ordenEquipos: Prisma.EquipoOrderByWithRelationInput = construirOrderByDinamico(
    input?.orderBy ?? "",
    input?.orderDirection ?? "",
  );

  const filtrosWhereEquipoTipo: Prisma.EquipoWhereInput = {
    ...(searchText
      ? {
          OR: [
            {
              inventarioId: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              tipo: {
                nombre: {
                  contains: searchText ?? undefined,
                  mode: "insensitive",
                },
              },
            },
            {
              marca: {
                nombre: {
                  contains: searchText ?? undefined,
                  mode: "insensitive",
                },
              },
            },
            {
              modelo: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              observaciones: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
            {
              palabrasClave: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
    ...(sede
      ? {
          sede: {
            id: parseInt(sede),
          },
        }
      : {}),
    ...(laboratorio
      ? {
          laboratorio: {
            id: parseInt(laboratorio),
          },
        }
      : {}),
    ...(tipo
      ? {
          tipo: {
            id: parseInt(tipo),
          },
        }
      : {}),
    ...(armario
      ? {
          armario: {
            id: parseInt(armario),
          },
        }
      : {}),
  };

  const [count, equipos] = await ctx.db.$transaction([
    ctx.db.equipo.count({
      where: filtrosWhereEquipoTipo,
    }),
    ctx.db.equipo.findMany({
      include: {
        armario: true,
        estante: true,
        laboratorio: true,
        marca: true,
        estado: true,
        tipo: true,
      },
      where: filtrosWhereEquipoTipo,
      orderBy: ordenEquipos,
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
  ]);

  return {
    count,
    equipos,
  };
};

type InputGetEquipoPorId = z.infer<typeof inputGetEquipo>;
export const getEquipoPorId = async (ctx: { db: PrismaClient }, input: InputGetEquipoPorId) => {
  const { id } = input;

  const equipo = await ctx.db.equipo.findUnique({
    include: {
      armario: true,
      estante: true,
      laboratorio: true,
      marca: true,
      estado: true,
      tipo: true,
      sede: true,
    },
    where: {
      id,
    },
  });

  return equipo;
};

type InputAgregarEquipo = z.infer<typeof inputAgregarEquipo>;
export const agregarEquipo = async (ctx: { db: PrismaClient }, input: InputAgregarEquipo, userId: string) => {
  try {
    const nuevoEquipo = await ctx.db.$transaction(async (tx) => {
      const ultimoInventarioId = await getUltimoEquipoInventarioId({ db: tx });

      const equipo = await tx.equipo.create({
        data: {
          observaciones: input.observaciones,
          palabrasClave: input.palabrasClave,

          inventarioId: generarEquipoInventarioId(ultimoInventarioId + 1),

          modelo: input.modelo,
          numeroSerie: input.numeroSerie,
          usuarioCreadorId: userId,
          usuarioModificadorId: userId,

          tipoId: input.tipoId,
          marcaId: input.marcaId,
          sedeId: Number(input.sedeId),
          laboratorioId: Number(input.laboratorioId),
          armarioId: Number(input.armarioId),
          estanteId: Number(input.estanteId),
          estadoId: Number(input.estadoId),
        },
      });

      return equipo;
    });

    return nuevoEquipo;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Ocurrió un error al agregar el equipo, intente agregarlo de nuevo");
      }
    }

    throw new Error("Error agregando equipo");
  }
};

type InputBorrarEquipo = z.infer<typeof inputEliminarEquipo>;
export const eliminarEquipo = async (ctx: { db: PrismaClient }, input: InputBorrarEquipo) => {
  try {
    const equipo = await ctx.db.equipo.delete({
      where: {
        id: input.id,
      },
    });

    return equipo;
  } catch (error) {
    throw new Error(`Error eliminando equipo ${input.id}`);
  }
};

type InputEditarEquipo = z.infer<typeof inputEditarEquipos>;
export const editarEquipo = async (ctx: { db: PrismaClient }, input: InputEditarEquipo, userId: string) => {
  try {
    const equipo = await ctx.db.equipo.update({
      data: {
        observaciones: input.observaciones,
        palabrasClave: input.palabrasClave,

        modelo: input.modelo,
        numeroSerie: input.numeroSerie,
        usuarioModificadorId: userId,

        tipoId: input.tipoId,
        marcaId: input.marcaId,
        sedeId: Number(input.sedeId),
        laboratorioId: Number(input.laboratorioId),
        armarioId: Number(input.armarioId),
        estanteId: Number(input.estanteId),
        estadoId: Number(input.estadoId),
      },
      where: {
        id: input.id,
      },
    });

    return equipo;
  } catch (error) {
    throw new Error(`Error modificando equipo ${input.id}`);
  }
};

export const getAllMarcas = async (ctx: { db: PrismaClient }) => {
  const marcas = await ctx.db.equipoMarca.findMany({
    orderBy: {
      nombre: "asc",
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  return marcas;
};

export const getAllEstados = async (ctx: { db: PrismaClient }) => {
  const estados = await ctx.db.equipoEstado.findMany({
    orderBy: {
      nombre: "asc",
    },
    select: {
      id: true,
      nombre: true,
    },
  });

  return estados;
};

type InputGetAllArmarios = z.infer<typeof inputGetArmarios>;
export const getAllArmarios = async (ctx: { db: PrismaClient }, input: InputGetAllArmarios) => {
  const { laboratorioId } = input;

  const armarios = await ctx.db.armario.findMany({
    select: {
      id: true,
      nombre: true,
      laboratorio: true,
    },
    where: {
      laboratorioId: laboratorioId,
    },
    orderBy: {
      nombre: "asc",
    },
  });

  return armarios;
};

export const getAllModelos = async (ctx: { db: PrismaClient }) => {
  const equipos = await ctx.db.equipo.findMany({
    orderBy: {
      modelo: "asc",
    },
    select: {
      modelo: true,
    },
    distinct: ["modelo"],
  });

  return equipos.filter((equipo) => equipo.modelo !== null).map((equipo) => equipo.modelo) as string[];
};

type InputAgregarMarca = z.infer<typeof inputAgregarMarca>;
export const agregarMarca = async (ctx: { db: PrismaClient }, input: InputAgregarMarca, userId: string) => {
  try {
    const nuevaMarca = await ctx.db.$transaction(async (tx) => {
      const existeMarca = await ctx.db.equipoMarca.findFirst({
        where: {
          nombre: {
            equals: input.nombre,
            mode: "insensitive",
          },
        },
      });

      if (existeMarca) {
        throw new Error("El nombre de la marca ya existe");
      }

      const marca = await tx.equipoMarca.create({
        data: {
          nombre: input.nombre,
          usuarioCreadorId: userId,
        },
      });

      return marca;
    });

    return nuevaMarca;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Ocurrió un error al agregar la marca, intente agregarlo de nuevo");
      }
    }

    throw new Error("Error agregando marca");
  }
};
