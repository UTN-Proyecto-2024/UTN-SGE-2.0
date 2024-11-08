import { sendEmail } from "./email";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";
import { type PrismaClient } from "@prisma/client";
import { getReservaParaEmail, getReservaDevolucionParaEmail } from "../../repositories/reservas/biblioteca.repository";

export const enviarMailReservaLibroProcedure = async (ctx: { db: PrismaClient }, input: { reservaId: number }) => {
  const { reservaId } = input;

  const reservaData = await getReservaParaEmail(ctx, { id: reservaId });

  await sendEmail(ctx, {
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

export const enviarMailRenovarLibroProcedure = async (ctx: { db: PrismaClient }, reservaId: number) => {
  const reservaData = await getReservaParaEmail(ctx, { id: reservaId });

  if (!reservaData) {
    throw new Error("No se encontró la reserva para enviar el email.");
  }

  await sendEmail(ctx, {
    asunto: "Reserva de libro renovada",
    to: reservaData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: reservaData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: reservaData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Has renovado el préstamo del libro</strong> <br/> <em>${reservaData.libroNombre}</em>`,
    hipervinculo: BIBLIOTECA_ROUTE.misPrestamosRuta,
  });
};

export const enviarMailDevolverLibroProcedure = async (ctx: { db: PrismaClient }, input: { libroId: number }) => {
  const reservaData = await getReservaDevolucionParaEmail(ctx, { libroId: input.libroId });

  await sendEmail(ctx, {
    asunto: "Devolución de libro confirmada",
    to: reservaData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: reservaData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: reservaData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Has devuelto el libro</strong> <br/> <em>${reservaData.libroNombre}</em>`,
    hipervinculo: BIBLIOTECA_ROUTE.misPrestamosRuta,
  });
};
