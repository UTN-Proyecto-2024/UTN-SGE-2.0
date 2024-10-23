import nodemailer from "nodemailer";
import { emailTemplate } from "../../utils/emailTemplate";

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

type EmailParams = {
  to: string;
  asunto: string;
  usuario: {
    nombre: string;
    apellido: string;
  };
  textoMail: string;
  palabraClave: string;
  hipervinculo: string;
};

export const sendEmail = async (props: EmailParams) => {
  const usuario = props.usuario.nombre + " " + props.usuario.apellido;

  const mailOptions = {
    from: fromEmail,
    to: receptorTesting ?? props.to,
    subject: props.asunto,
    html: emailTemplate({
      usuario,
      palabraClave: props.palabraClave,
      hipervinculo: `${baseRuta}/${props.hipervinculo}`,
      textoMail: props.textoMail,
    }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // TODO @Alex: Agregar mail para auditoria
    console.log("Correo enviado: %s", info.messageId);
    return info;
  } catch (error) {
    // TODO @Alex: Agregar mail para auditoria
    console.error("Error al enviar correo: ", error);
    throw new Error("No se pudo enviar el correo.");
  }
};
