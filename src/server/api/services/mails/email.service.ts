import { type emailReservaLibroCreada } from "@/shared/email";
import { sendEmail } from "./email";
import { getReservaParaEmail } from "../../repositories/reservas/biblioteca.repository";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";
import { type z } from "zod";
import { type PrismaClient } from "@prisma/client";

export const enviarMailReservaLibroProcedure = async (
  ctx: { db: PrismaClient },
  input: z.infer<typeof emailReservaLibroCreada>,
) => {
  const { reservaId } = input;

  const reservaData = await getReservaParaEmail(ctx, { id: reservaId });

  await sendEmail({
    asunto: "Reserva de libro creada",
    to: reservaData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: reservaData.usuarioSolicitante.nombre ?? "",
      apellido: reservaData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Has reservado el libro</strong> <br/> <em>${reservaData.libroNombre}</em>`,
    hipervinculo: BIBLIOTECA_ROUTE.misPrestamosRuta,
  });
};
