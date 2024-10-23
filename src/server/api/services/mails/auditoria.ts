import { type PrismaClient } from "@prisma/client";
import { type EmailParams, fromEmail } from "./email";

export const cargarMailAuditoria = async (ctx: { db: PrismaClient }, emailParams: EmailParams) => {
  const auditMail = await ctx.db.mails.create({
    data: {
      emisor: fromEmail,
      para: emailParams.to,
      cc: "",
      cco: "",
      contenido: emailParams,
      fechaEnvio: new Date(),
      asunto: emailParams.asunto,
    },
  });

  return auditMail;
};
