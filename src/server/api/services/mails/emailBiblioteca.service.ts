import { sendEmail } from "./email";
import {
  getReservaParaEmail,
  type InputRenovarPrestamoLibro,
  type InputGetReservas,
  renovarLibro,
  devolverLibro,
} from "../../repositories/reservas/biblioteca.repository";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";
import { type PrismaClient } from "@prisma/client";

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

export const enviarMailRenovarLibroProcedure = async (
  ctx: { db: PrismaClient },
  input: InputRenovarPrestamoLibro,
  userId: string,
) => {
  const { libroId, fechaInicio, fechaFin } = input;

  const renovacionData = await renovarLibro(ctx, { libroId, fechaInicio, fechaFin }, userId);

  await sendEmail(ctx, {
    asunto: "Reserva de libro renovada",
    to: renovacionData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: renovacionData.usuarioSolicitante?.nombre ?? "",
      apellido: renovacionData.usuarioSolicitante?.apellido ?? "",
    },
    textoMail: `<strong>Has renovado el préstamo del libro</strong> <br/> <em>${renovacionData.libroNombre}</em> <br> desde ${fechaInicio} hasta ${fechaFin}`,
    hipervinculo: BIBLIOTECA_ROUTE.misPrestamosRuta,
  });
};

export const enviarMailDevolverLibroProcedure = async (
  ctx: { db: PrismaClient },
  input: InputGetReservas,
  userId: string,
) => {
  const { libroId } = input;

  const reservaData = await devolverLibro(ctx, { libroId }, userId);

  await sendEmail(ctx, {
    asunto: "Devolución de libro confirmada",
    to: reservaData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: reservaData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: reservaData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Has devuelto el libro</strong> <br/> <em>${reservaData.libroNombre}</em> ha sido recibido correctamente.`,
    hipervinculo: BIBLIOTECA_ROUTE.misPrestamosRuta,
  });
};
