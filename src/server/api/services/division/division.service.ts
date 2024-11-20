import {
  inputEliminarDivision,
  inputEditarDivision,
  inputAgregarDivision,
  inputGetDivision,
} from "./../../../../shared/filters/divisiones-filter.schema";
import {
  getAllDivisiones,
  eliminarDivision,
  editarDivision,
  agregarDivision,
  getDivisionById,
} from "../../repositories/division/division.repository";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { Prisma, SgeNombre } from "@prisma/client";
import { verificarPermisos } from "@/server/permisos";

export const getTodasLasDivisiones = protectedProcedure.query(async ({ ctx }) => {
  return await getAllDivisiones(ctx);
});

type GroupedDivision = { anio: number; divisiones: { nombre: string; id: number }[] };

export const getDivisionesFiltradas = protectedProcedure.query(async ({ ctx }) => {
  const divisiones = await getAllDivisiones(ctx);
  const groupedMap = divisiones.reduce(
    (acc, division) => {
      if (!acc[division.anio]) acc[division.anio] = { anio: division.anio, divisiones: [] };
      acc[division.anio]?.divisiones.push({ nombre: division.nombre, id: division.id });
      return acc;
    },
    {} as Record<number, GroupedDivision>,
  );
  return Object.values(groupedMap);
});

export const eliminarDivisionProcedure = protectedProcedure
  .input(inputEliminarDivision)
  .mutation(async ({ ctx, input }) => {
    await verificarPermisos([SgeNombre.CURSOS_ABM]);
    validarInput(inputEliminarDivision, input);
    return await eliminarDivision(ctx, input);
  });

// Obtener una división por ID
export const getDivisionByIdProcedure = protectedProcedure.input(inputGetDivision).query(async ({ ctx, input }) => {
  validarInput(inputGetDivision, input);
  return await getDivisionById(ctx, input);
});

// Editar una división
export const editarDivisionProcedure = protectedProcedure
  .input(inputEditarDivision)
  .mutation(async ({ ctx, input }) => {
    await verificarPermisos([SgeNombre.CURSOS_ABM]);
    validarInput(inputEditarDivision, input);
    const userId = ctx.session.user.id;
    try {
      return await editarDivision(ctx, input, userId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          console.log(error);
          throw new Error("Ocurrió un error al editar la división");
        }
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Error editando división");
    }
  });

// Agregar nueva división
export const nuevaDivisionProcedure = protectedProcedure
  .input(inputAgregarDivision)
  .mutation(async ({ ctx, input }) => {
    await verificarPermisos([SgeNombre.CURSOS_ABM]);
    validarInput(inputAgregarDivision, input);

    const userId = ctx.session.user.id;

    try {
      return await agregarDivision(ctx, input, userId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          console.log(error);
          throw new Error("Ocurrió un error al agregar la división");
        }
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Error agregando división");
    }
  });
