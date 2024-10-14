import { z } from "zod";

export const inputGetUsuarioYRol = z.object({
  usuarioId: z.string(),
});
