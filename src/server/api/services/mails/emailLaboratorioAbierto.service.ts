import { sendEmail } from "./email";
import { type PrismaClient } from "@prisma/client";
import { LABORATORIO_ABIERTO_ROUTE } from "@/shared/server-routes";
import {
  aprobarReserva,
  cancelarReserva,
  getReservaLaboratorioAbiertoParaEmail,
  rechazarReserva,
} from "../../repositories/reservas/laboratorioAbierto.repository";

export const enviarMailReservaLaboratorioAbiertoProcedure = async (ctx: { db: PrismaClient }, id: number) => {
  const reservaData = await getReservaLaboratorioAbiertoParaEmail(ctx, { id: id });

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto confirmada",
    to: reservaData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: reservaData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: reservaData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Has reservado el laboratorio: </strong> <br/> <em>${reservaData.laboratorioNombre}</em>`,
    hipervinculo:
      LABORATORIO_ABIERTO_ROUTE.subRutas.find((ruta) => ruta.label === "Mis reservas")?.href ??
      "/laboratorio_abierto/mis_reservas",
  });
};

export const enviarMailRechazoLaboratorioAbiertoProcedure = async (
  ctx: { db: PrismaClient },
  id: number,
  motivo: string,
  userId: string,
) => {
  const rechazoData = await rechazarReserva(
    ctx,
    {
      id,
      motivo,
    },
    userId,
  );

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto confirmada",
    to: rechazoData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: rechazoData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: rechazoData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Se rechazó tu reserva de laboratorio</strong>`,
    hipervinculo:
      LABORATORIO_ABIERTO_ROUTE.subRutas.find((ruta) => ruta.label === "Mis reservas")?.href ??
      "/laboratorio_abierto/mis_reservas",
  });
};

export const enviarMailAproboLaboratorioAbiertoProcedure = async (
  ctx: { db: PrismaClient },
  id: number,
  userId: string,
) => {
  const aprobacionData = await aprobarReserva(
    ctx,
    {
      id,
      equipoReservado: [],
      inventarioRevisado: [],
    },
    userId,
  );

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto confirmada",
    to: aprobacionData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: aprobacionData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: aprobacionData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Tu reserva de laboratorio ha sido aprobada</strong>`,
    hipervinculo:
      LABORATORIO_ABIERTO_ROUTE.subRutas.find((ruta) => ruta.label === "Mis reservas")?.href ??
      "/laboratorio_abierto/mis_reservas",
  });
};

export const enviarMailCancelacionLaboratorioAbiertoProcedure = async (
  ctx: { db: PrismaClient },
  id: number,
  userId: string,
) => {
  const cancelacionData = await cancelarReserva(ctx, { id }, userId);

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto cancelada",
    to: cancelacionData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: cancelacionData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: cancelacionData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Tu reserva de laboratorio: ${cancelacionData.nombreLaboratorio} ha sido cancelada</strong>`,
    hipervinculo:
      LABORATORIO_ABIERTO_ROUTE.subRutas.find((ruta) => ruta.label === "Mis reservas")?.href ??
      "/laboratorio_abierto/mis_reservas",
  });
};
