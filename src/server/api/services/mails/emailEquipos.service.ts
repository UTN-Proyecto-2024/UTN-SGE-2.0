import { sendEmail } from "./email";
import { EQUIPOS_ROUTE } from "@/shared/server-routes";
import {
  getReservaEquipoParaEmail,
  getReservaRenovacionEquipoParaEmail,
} from "../../repositories/reservas/equipo.repository";
import { type PrismaClient } from "@prisma/client";

export const enviarMailReservaEquipoProcedure = async (ctx: { db: PrismaClient }, id: number) => {
  const reservaData = await getReservaEquipoParaEmail(ctx, { id: id });

  await sendEmail(ctx, {
    asunto: "Reserva de equipo confirmada",
    to: reservaData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: reservaData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: reservaData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Has reservado el equipo</strong> <br/> <em>${reservaData.equipoModelo}</em>`,
    hipervinculo: EQUIPOS_ROUTE.subRutas.find((ruta) => ruta.label === "Tipos")?.href ?? "/equipos/prestamos",
  });
};

export const enviarMailRenovarEquipoProcedure = async (
  ctx: { db: PrismaClient },
  input: { equipoId: number; fechaInicio: Date; fechaFin: Date },
) => {
  const renovacionData = await getReservaRenovacionEquipoParaEmail(ctx, { equipoId: input.equipoId });

  await sendEmail(ctx, {
    asunto: "Reserva de equipo renovada",
    to: renovacionData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: renovacionData.usuarioSolicitante?.nombre ?? "Usuario",
      apellido: renovacionData.usuarioSolicitante?.apellido ?? "",
    },

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    textoMail: `<strong>Has renovado el préstamo del equipo</strong> <br/> <em>${renovacionData.equipoModelo}</em> <br> desde ${input.fechaInicio} hasta ${input.fechaFin}`,
    hipervinculo: EQUIPOS_ROUTE.subRutas.find((ruta) => ruta.label === "Tipos")?.href ?? "/equipos/prestamos",
  });
};

export const enviarMailDevolverEquipoProcedure = async (ctx: { db: PrismaClient }, input: { equipoId: number }) => {
  const reservaData = await getReservaEquipoParaEmail(ctx, { id: input.equipoId });

  await sendEmail(ctx, {
    asunto: "Devolución de equipo confirmada",
    to: reservaData.usuarioSolicitante.email ?? "",
    usuario: {
      nombre: reservaData.usuarioSolicitante.nombre ?? "Usuario",
      apellido: reservaData.usuarioSolicitante.apellido ?? "",
    },
    textoMail: `<strong>Has devuelto el equipo</strong> <br/> <em>${reservaData.equipoModelo}</em> ha sido recibido correctamente.`,
    hipervinculo: EQUIPOS_ROUTE.subRutas.find((ruta) => ruta.label === "Tipos")?.href ?? "/equipos/prestamos",
  });
};
