import { sendEmail } from "./email";
import { type PrismaClient } from "@prisma/client";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import { getReservaLaboratorioCerradoParaEmail } from "../../repositories/reservas/laboratorioCerrado.repository";

export const enviarMailReservaLaboratorioCerradoProcedure = async (ctx: { db: PrismaClient }, id: number) => {
  const reservaData = await getReservaLaboratorioCerradoParaEmail(ctx, { id: id });

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio cerrado confirmada",
    to: reservaData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: reservaData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: reservaData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Has reservado el laboratorio cerrado: </strong> <br/> <em>${reservaData.laboratorioNombre}</em>`,
    hipervinculo: LABORATORIO_ROUTE.misReservasRuta,
  });
};

export const enviarMailRechazoLaboratorioCerradoProcedure = async (ctx: { db: PrismaClient }, id: number) => {
  const rechazoData = await getReservaLaboratorioCerradoParaEmail(ctx, { id });

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto rechazada",
    to: rechazoData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: rechazoData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: rechazoData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Se rechazó tu reserva de laboratorio cerrado</strong> <br/>`,
    hipervinculo: LABORATORIO_ROUTE.misReservasRuta,
  });
};

export const enviarMailAproboLaboratorioCerradoProcedure = async (ctx: { db: PrismaClient }, id: number) => {
  const aprobacionData = await getReservaLaboratorioCerradoParaEmail(ctx, { id });

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto confirmada",
    to: aprobacionData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: aprobacionData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: aprobacionData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Tu reserva de laboratorio ha sido aprobada</strong>`,
    hipervinculo: LABORATORIO_ROUTE.misReservasRuta,
  });
};

export const enviarMailCancelacionLaboratorioCerradoProcedure = async (ctx: { db: PrismaClient }, id: number) => {
  const cancelacionData = await getReservaLaboratorioCerradoParaEmail(ctx, { id });

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto cancelada",
    to: cancelacionData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: cancelacionData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: cancelacionData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Tu reserva de laboratorio: ${cancelacionData.laboratorioNombre} ha sido cancelada</strong>`,
    hipervinculo: LABORATORIO_ROUTE.misReservasRuta,
  });
};
