import { construirOrderByDinamico } from "@/shared/dynamic-orderby";
import type {
  inputEditarCurso,
  inputEliminarCurso,
  inputAgregarCurso,
  inputGetCurso,
  inputGetCursos,
  inputAgregarCursoBulkInsert,
} from "@/shared/filters/cursos-filter.schema";
import { Prisma, type PrismaClient } from "@/generated/prisma";
import { type z } from "zod";
import { informacionUsuario } from "../usuario-helper";

type InputGetAll = z.infer<typeof inputGetCursos>;

export const getAllCursos = async (ctx: { db: PrismaClient }, input: InputGetAll, userId: string) => {
  const {
    // pageIndex,
    // pageSize,
    materia,
    anioDeCarrera,
    filtrByUserId,
    filtrByCatedraId,
    orderBy,
    orderDirection,
    searchText,
    filtrByActivo,
  } = input;

  const ordenCursos: Prisma.CursoOrderByWithRelationInput | Prisma.CursoOrderByWithRelationInput[] = orderBy
    ? construirOrderByDinamico(orderBy ?? "", orderDirection ?? "")
    : [
        { anioDeCarrera: "asc" },
        { materia: { nombre: "asc" } },
        { division: { nombre: "asc" } },
        { sede: { nombre: "desc" } },
        { ac: "asc" },
        { turno: "asc" },
      ];

  const where: Prisma.CursoWhereInput = {
    materiaId: materia ? parseInt(materia) : undefined,
    anioDeCarrera: anioDeCarrera ? parseInt(anioDeCarrera) : undefined,
    activo: filtrByActivo === "true" ? true : undefined,
    AND: [
      {
        ...(filtrByUserId === "true" && filtrByCatedraId !== "true"
          ? {
              OR: [
                {
                  profesorId: userId,
                },
                {
                  ayudantes: {
                    some: {
                      usuario: {
                        id: userId,
                      },
                    },
                  },
                },
              ],
            }
          : {}),
        ...(filtrByCatedraId === "true"
          ? {
              OR: [
                {
                  materia: {
                    jefeTrabajoPracticos: {
                      some: {
                        userId: userId,
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      {
        OR: [
          {
            division: {
              nombre: {
                contains: searchText ?? undefined,
                mode: "insensitive",
              },
            },
          },
          {
            profesor: {
              OR: [
                {
                  nombre: {
                    contains: searchText ?? undefined,
                    mode: "insensitive",
                  },
                },
                { apellido: { contains: searchText ?? undefined, mode: "insensitive" } },
              ],
            },
          },
          {
            ayudantes: {
              some: {
                usuario: {
                  OR: [
                    {
                      nombre: {
                        contains: searchText ?? undefined,
                        mode: "insensitive",
                      },
                    },
                    { apellido: { contains: searchText ?? undefined, mode: "insensitive" } },
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  };

  const [cursos, count] = await ctx.db.$transaction([
    ctx.db.curso.findMany({
      include: {
        materia: true,
        division: true,
        sede: true,
        ayudantes: {
          include: {
            usuario: {
              select: informacionUsuario,
            },
          },
        },
        profesor: {
          select: informacionUsuario,
        },
      },
      where: where,
      orderBy: ordenCursos,
      // skip: parseInt(pageIndex) * parseInt(pageSize),
      // take: parseInt(pageSize),
    }),
    ctx.db.curso.count({ where }),
  ]);

  return {
    count,
    cursos,
  };
};

type InputGetCursoPorId = z.infer<typeof inputGetCurso>;
export const getCursoPorId = async (ctx: { db: PrismaClient }, input: InputGetCursoPorId) => {
  const { id } = input;

  const curso = await ctx.db.curso.findUnique({
    include: {
      materia: true,
      division: true,
      sede: true,
      ayudantes: {
        select: {
          usuario: {
            select: informacionUsuario,
          },
        },
      },
      profesor: {
        select: informacionUsuario,
      },
    },
    where: {
      id,
    },
  });

  return curso;
};

type InputAgregarCurso = z.infer<typeof inputAgregarCurso>;
export const agregarCurso = async (ctx: { db: PrismaClient }, input: InputAgregarCurso, userId: string) => {
  try {
    const curso = await ctx.db.curso.create({
      data: {
        materiaId: parseInt(input.materiaId),
        sedeId: Number(input.sedeId),
        ac: input.ac,
        dia1: input.dia1,
        dia2: input.dia2 ? input.dia2 : undefined,
        duracion1: input.duracion1,
        duracion2: input.duracion2 ? input.duracion2 : undefined,
        horaInicio1: input.horaInicio1,
        horaInicio2: input.horaInicio2 ? input.horaInicio2 : undefined,
        turno: input.turno,
        activo: true,
        anioDeCarrera: Number(input.anioDeCarrera),
        divisionId: parseInt(input.divisionId),
        profesorId: input.profesorUserId,
        usuarioCreadorId: userId,
        usuarioModificadorId: userId,
        ayudantes: {
          createMany: {
            data:
              input.ayudanteUsersIds?.map((ayudanteId) => ({
                usuarioCreadorId: userId,
                usuarioModificadorId: userId,
                userId: ayudanteId,
              })) ?? [],
          },
        },
      },
    });

    return curso;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("El código de curso ya existe");
      }
    }

    throw new Error("Error agregando curso");
  }
};

type InputAgregarCursoBulkInsert = z.infer<typeof inputAgregarCursoBulkInsert>;
export const agregarCursoBulkInsert = async (
  ctx: { db: PrismaClient },
  input: InputAgregarCursoBulkInsert,
  userId: string,
) => {
  try {
    const division = await ctx.db.division.findUnique({
      where: {
        nombre: input.division,
      },
    });
    const materia = await ctx.db.materia.findUnique({
      where: {
        codigo: input.materia,
      },
    });
    if (!materia) {
      throw new Error("No se encontró la materia");
    }
    if (!division) {
      throw new Error("No se encontró la división");
    }
    if (materia.anio !== division.anio) {
      throw new Error("La materia y la división no pertenecen al mismo año");
    }
    const profesor = await ctx.db.user.findUnique({
      where: {
        name: input.profesor,
      },
    });
    if (!profesor) {
      throw new Error("No se encontró el profesor");
    }
    const sede = await ctx.db.sede.findUnique({
      where: {
        nombre: input.sede,
      },
    });
    if (!sede) {
      throw new Error("No se encontró la sede");
    }
    const curso = await ctx.db.curso.create({
      data: {
        materiaId: materia.id,
        sedeId: sede.id,
        ac: input.ac,
        dia1: input.dia1,
        dia2: input.dia2 ? input.dia2 : undefined,
        duracion1: input.duracion1,
        duracion2: input.duracion2 ? input.duracion2 : undefined,
        horaInicio1: input.horaInicio1,
        horaInicio2: input.horaInicio2 ? input.horaInicio2 : undefined,
        turno: input.turno,
        activo: input.activo === "true",
        anioDeCarrera: division.anio,
        divisionId: division.id,
        profesorId: profesor.id,
        usuarioCreadorId: userId,
        usuarioModificadorId: userId,
      },
    });

    return curso;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("El código de curso ya existe");
      }
    }

    throw new Error("Error agregando curso");
  }
};

type inputEliminarCurso = z.infer<typeof inputEliminarCurso>;
export const eliminarCurso = async (ctx: { db: PrismaClient }, input: inputEliminarCurso) => {
  try {
    const curso = await ctx.db.curso.delete({
      where: {
        id: input.id,
      },
    });

    return curso;
  } catch (error) {
    throw new Error(`Error eliminando curso ${input.id}`);
  }
};

type InputEditarCurso = z.infer<typeof inputEditarCurso>;
export const editarCurso = async (ctx: { db: PrismaClient }, input: InputEditarCurso, userId: string) => {
  try {
    const libro = await ctx.db.curso.update({
      data: {
        activo: input.activo,

        sedeId: Number(input.sedeId),
        materiaId: Number(input.materiaId),
        ac: input.ac,
        dia1: input.dia1,
        dia2: input.dia2 ? input.dia2 : null,
        duracion1: input.duracion1,
        duracion2: input.duracion2 ? input.duracion2 : null,
        horaInicio1: input.horaInicio1,
        horaInicio2: input.horaInicio2 ? input.horaInicio2 : null,
        turno: input.turno,
        anioDeCarrera: Number(input.anioDeCarrera),
        divisionId: parseInt(input.divisionId),
        profesorId: input.profesorUserId,
        usuarioModificadorId: userId,

        ayudantes: {
          deleteMany: {},
          createMany: {
            data:
              input.ayudanteUsersIds?.map((ayudanteId) => ({
                usuarioCreadorId: userId,
                usuarioModificadorId: userId,
                userId: ayudanteId,
              })) ?? [],
          },
        },
      },
      where: {
        id: input.id,
      },
    });

    return libro;
  } catch (error) {
    throw new Error(`Error modificando curso ${input.id}`);
  }
};
