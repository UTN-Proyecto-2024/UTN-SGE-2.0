import { verificarPermisos } from "@/server/permisos";
import { SgeNombre } from "@prisma/client";
import {
  agregarCurso,
  agregarCursoBulkInsert,
  editarCurso,
  eliminarCurso,
  getAllCursos,
  getCursoPorId,
} from "../../repositories/cursos/cursos.repository";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import {
  inputAgregarCurso,
  inputAgregarCursoBulkInsert,
  inputEditarCurso,
  inputEliminarCurso,
  inputGetCurso,
  inputGetCursos,
} from "@/shared/filters/cursos-filter.schema";

export const getTodosLosCursosProcedure = protectedProcedure.input(inputGetCursos).query(async ({ ctx, input }) => {
  validarInput(inputGetCursos, input);

  const userId = ctx.session.user.id;

  const cursos = await getAllCursos(ctx, input, userId);

  return cursos;
});

export const cursoPorIdProcedure = protectedProcedure.input(inputGetCurso).query(async ({ ctx, input }) => {
  validarInput(inputGetCurso, input);

  const curso = await getCursoPorId(ctx, input);

  return curso;
});

export const nuevoCursoProcedure = protectedProcedure.input(inputAgregarCurso).mutation(async ({ ctx, input }) => {
  await verificarPermisos([SgeNombre.CURSOS_ABM]);
  validarInput(inputAgregarCurso, input);

  const userId = ctx.session.user.id;

  const curso = await agregarCurso(ctx, input, userId);

  return curso;
});

export const nuevoCursoBulkInsertProcedure = protectedProcedure
  .input(inputAgregarCursoBulkInsert)
  .mutation(async ({ ctx, input }) => {
    await verificarPermisos([SgeNombre.CURSOS_ABM]);
    validarInput(inputAgregarCursoBulkInsert, input);
    const userId = ctx.session.user.id;
    const curso = await agregarCursoBulkInsert(ctx, input, userId);
    return curso;
  });

export const editarCursoProcedure = protectedProcedure.input(inputEditarCurso).mutation(async ({ ctx, input }) => {
  await verificarPermisos([SgeNombre.CURSOS_ABM]);
  validarInput(inputEditarCurso, input);

  const userId = ctx.session.user.id;

  const curso = await editarCurso(ctx, input, userId);

  return curso;
});

export const eliminarCursoProcedure = protectedProcedure.input(inputEliminarCurso).mutation(async ({ ctx, input }) => {
  await verificarPermisos([SgeNombre.CURSOS_ABM]);
  validarInput(inputEliminarCurso, input);

  const curso = await eliminarCurso(ctx, input);

  return curso;
});
