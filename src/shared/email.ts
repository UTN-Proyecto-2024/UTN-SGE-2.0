import { z } from "zod";

export const emailReservaLibroCreada = z.object({
  reservaId: z.number(),
});
