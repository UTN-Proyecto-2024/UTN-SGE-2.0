import nodemailer from "nodemailer";
import { emailTemplate } from "../../utils/emailTemplate";
import { cargarMailAuditoria } from "./auditoria";
import { type PrismaClient } from "@prisma/client";

const isTestingEmail = process.env.SMTP_TESTING === "true";
const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const secure = process.env.SMTP_SECURE === "true";
const auth = isTestingEmail
  ? {
      user: process.env.SMTP_TESTING_EMAIL_USER,
      pass: process.env.SMTP_TESTING_EMAIL_PASSWORD,
    }
  : undefined;
const emisor = process.env.SMTP_MAIL_EMISOR;
const baseRuta = process.env.RUTA_ACTUAL;

const receptorTesting = isTestingEmail ? process.env.SMTP_TESTING_EMAIL_RECEPTOR : undefined;

export const fromEmail = `"Sistema de Gestión Electrónica" <${emisor}>`;

export const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: secure,
  auth,
});

if (!transporter) {
  throw new Error("No se pudo crear el transporte de correo");
}

export type EmailParams = {
  to: string;
  asunto: string;
  usuario: {
    nombre: string;
    apellido: string;
  };
  textoMail: string;
  hipervinculo: string;
};

export const sendEmail = async (ctx: { db: PrismaClient }, props: EmailParams) => {
  const usuario = props.usuario.nombre + " " + props.usuario.apellido;

  const mailOptions = {
    from: fromEmail,
    to: receptorTesting ?? props.to,
    subject: props.asunto,
    html: emailTemplate({
      usuario,
      hipervinculo: `${baseRuta}/${props.hipervinculo}`,
      textoMail: props.textoMail,
    }),
  };

  const mailEnviado = await transporter.sendMail(mailOptions);

  await cargarMailAuditoria(ctx, props);

  return mailEnviado;
};
