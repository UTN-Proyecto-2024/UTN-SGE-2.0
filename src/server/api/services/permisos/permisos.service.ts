import { protectedProcedure } from "../../trpc";
import { getUsuarioYPermisos } from "../../repositories/permisos/permisos.repository";

export const getUsuarioPermiso = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session.user.id;

  const usuario = await getUsuarioYPermisos(ctx, { usuarioId: userId });

  console.log(usuario, userId);

  return usuario;
});

export const usuarioTienePermisos = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session.user.id;

  const usuario = await getUsuarioYPermisos(ctx, { usuarioId: userId });

  let tienePermiso = false;
  if (usuario && usuario.usuarioRol) {
    usuario.usuarioRol.forEach((rol) => {
      rol.rol.rolPermiso.forEach((rolPermiso) => {
        if (rolPermiso.permiso) {
          tienePermiso = true;
        }
      });
    });
  }
  return tienePermiso;
});
