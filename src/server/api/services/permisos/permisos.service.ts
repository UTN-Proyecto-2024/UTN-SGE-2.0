import { protectedProcedure } from "../../trpc";
import { getUsuarioYPermisos, verificarPermisoUsuario } from "../../repositories/permisos/permisos.repository";
import { permisosSchema } from "@/shared/filters/permisos-filter";
import { type SgeNombre, type PrismaClient } from "@prisma/client";

export const tienePermiso = async (ctx: { db: PrismaClient }, permisos: SgeNombre[], userId: string) => {
  if (permisos.length === 0) {
    return true;
  }

  const tienePermiso = await verificarPermisoUsuario(ctx, userId, permisos);

  return tienePermiso;
};

export const getUsuarioPermiso = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session.user.id;

  const usuario = await getUsuarioYPermisos(ctx, { usuarioId: userId });

  return usuario;
});

export const usuarioTienePermisos = protectedProcedure.input(permisosSchema).query(async ({ ctx, input }) => {
  const userId = ctx.session.user.id;
  const permisos = input.permisos;

  return await tienePermiso(ctx, permisos, userId);
});
