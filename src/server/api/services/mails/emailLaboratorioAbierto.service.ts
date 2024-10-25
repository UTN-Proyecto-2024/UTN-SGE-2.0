import { sendEmail } from "./email";
import { type PrismaClient } from "@prisma/client";
import { LABORATORIO_ABIERTO_ROUTE } from "@/shared/server-routes";
import { getReservaLaboratorioAbiertoParaEmail } from "../../repositories/reservas/laboratorioAbierto.repository";

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

export const enviarMailRechazoLaboratorioCerradoProcedure = async (
  ctx: { db: PrismaClient },
  id: number,
  motivo: string,
) => {
  const rechazoData = await getReservaLaboratorioAbiertoParaEmail(ctx, { id });

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto rechazada",
    to: rechazoData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: rechazoData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: rechazoData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Se rechazó tu reserva de laboratorio</strong> <br/> Motivo: ${motivo}`,
    hipervinculo:
      LABORATORIO_ABIERTO_ROUTE.subRutas.find((ruta) => ruta.label === "Mis reservas")?.href ??
      "/laboratorio_abierto/mis_reservas",
  });
};

export const enviarMailAproboLaboratorioAbiertoProcedure = async (ctx: { db: PrismaClient }, id: number) => {
  const aprobacionData = await getReservaLaboratorioAbiertoParaEmail(ctx, { id });

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

export const enviarMailCancelacionLaboratorioAbiertoProcedure = async (ctx: { db: PrismaClient }, id: number) => {
  const cancelacionData = await getReservaLaboratorioAbiertoParaEmail(ctx, { id });

  await sendEmail(ctx, {
    asunto: "Reserva de laboratorio abierto cancelada",
    to: cancelacionData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: cancelacionData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: cancelacionData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Tu reserva de laboratorio: ${cancelacionData.laboratorioNombre} ha sido cancelada</strong>`,
    hipervinculo:
      LABORATORIO_ABIERTO_ROUTE.subRutas.find((ruta) => ruta.label === "Mis reservas")?.href ??
      "/laboratorio_abierto/mis_reservas",
  });
};
