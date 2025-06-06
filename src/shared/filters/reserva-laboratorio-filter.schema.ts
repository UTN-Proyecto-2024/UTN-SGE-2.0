import { z } from "zod";
import { enumReservaEstatus } from "./reservas-filter.schema";

const inputEquipoReservado = z.object({ equipoId: z.number(), cantidad: z.number() });

export const inputGetReservaLaboratorioPorUsuarioId = z.object({
  id: z.string().min(1),
});

export const inputGetReservaLaboratorioPorId = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
});

const inputReservaLaboratorioDiscrecionalBase = z.object({
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  requierePc: z.boolean().default(false),
  requiereProyector: z.boolean().default(false),
  equipoReservado: z.array(inputEquipoReservado).default([]),
  observaciones: z.string().max(250, { message: "Máximo 250 caracteres" }).default(""),
  aceptoTerminos: z.boolean().refine((value) => value === true, { message: "Debe aceptar los términos y condiciones" }),
});

export const inputReservaLaboratorioDiscrecional = z
  .object({
    sedeId: z.string().refine((value) => parseInt(value) >= 0, { message: "Debe seleccionar una sede" }),
    horaInicio: z.string().min(1, { message: "Requerido" }),
    horaFin: z.string().min(1, { message: "Requerido" }),
    laboratorioId: z.string().refine((value) => parseInt(value) >= 0, { message: "Debe seleccionar un laboratorio" }),
    agregarAPantalla: z.boolean().default(false),
    discrecionalTitulo: z.string().default(""),
    discrecionalMateriaId: z.string().optional(),
    discrecionalDocenteId: z.string().optional(),
  })
  .merge(inputReservaLaboratorioDiscrecionalBase)
  .refine((data) => new Date(`1970-01-01T${data.horaInicio}:00Z`) < new Date(`1970-01-01T${data.horaFin}:00Z`), {
    message: "La hora de inicio debe ser menor que la hora de fin",
    path: ["horaInicio"], // Indica el campo que causa el error
  });

export const inputReservaLaboratorioCerrado = z
  .object({
    cursoId: z.number().min(1, { message: "Requerido" }),
  })
  .merge(inputReservaLaboratorioDiscrecionalBase);

export const inputReservaLaboratorioAbierto = z.object({
  tipo: z.enum(["LA", "TLA", "TLA_BASICA"]),
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  horaInicio: z.string().min(1, { message: "Requerido" }),
  horaFin: z.string().min(1, { message: "Requerido" }),
  concurrentes: z.string().min(1, { message: "Requerido" }),
  sedeId: z.string().refine((value) => parseInt(value) >= 0, { message: "Debe seleccionar una sede" }),
  equipoReservado: z.array(inputEquipoReservado).default([]),
  observaciones: z.string().default(""),
  especialidad: z.string().optional().default(""),
  aceptoTerminos: z.boolean().refine((value) => value === true, { message: "Debe aceptar los términos y condiciones" }),
});

export const inputReservaLaboratorioAbiertoForm = z.object({
  tipo: z.enum(["LA", "TLA", "TLA_BASICA"]),
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  turno: z.string().min(1, { message: "Requerido" }),
  concurrentes: z.string().min(1, { message: "Requerido" }),
  sedeId: z.string().refine((value) => parseInt(value) >= 0, { message: "Debe seleccionar una sede" }),
  equipoReservado: z.array(inputEquipoReservado).default([]),
  observaciones: z.string().min(1, { message: "Requerido" }),
  especialidad: z.string().optional().default(""),
  aceptoTerminos: z.boolean().refine((value) => value === true, { message: "Debe aceptar los términos y condiciones" }),
});

export const inputEditarReservaLaboratorioForm = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  tipo: z.enum(["LA", "TLA", "TLA_BASICA"]),
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  turno: z.string().min(1, { message: "Requerido" }),
  concurrentes: z.string().min(1, { message: "Requerido" }),
  sedeId: z.string().refine((value) => parseInt(value) >= 0, { message: "Debe seleccionar una sede" }),
  equipoReservado: z.array(inputEquipoReservado).default([]),
  observaciones: z.string().default(""),
  especialidad: z.string().optional().default(""),
  aceptoTerminos: z.boolean().refine((value) => value === true, { message: "Debe aceptar los términos y condiciones" }),
});

export const inputAprobarReservaLaboratorioAbiertoSchema = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  tutorId: z.string().optional(),
  inventarioRevisado: z.array(z.string()),
  laboratorioId: z.string().min(1, { message: "Requerido" }),
  equipoReservado: z.array(inputEquipoReservado).default([]),
});

export const inputEditarReservaLaboratorioAbiertoSchema = z
  .object({
    id: z.number().positive().min(1, { message: "Requerido" }),
  })
  .merge(inputReservaLaboratorioAbierto);

export const inputGetAllSolicitudesReservaLaboratorioAbierto = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("20").catch("20"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum([
      "id",
      "laboratorioId",
      "sede",
      "reserva_usuarioSolicito_apellido",
      "reserva_fechaHoraInicio",
      "reserva_fechaHoraFin",
    ])
    .default("id")
    .catch("id"),
  orderDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  searchText: z.string().default(""),
  estatus: enumReservaEstatus.default("").catch(""),
  filtrByUserId: z.enum(["true", "false"]).optional(),
  pasadas: z.enum(["true", "false"]).optional(),
  aprobadas: z.enum(["true", "false"]).optional(),
});

export const inputRechazarReservaLaboratorioAbierto = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  motivo: z.string().min(1, { message: "Requerido" }),
});

export const inputCancelarReservaLaboratorioAbierto = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
});

export const inputAprobarReservaLaboratorioCerradoSchema = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  inventarioRevisado: z.array(z.string()),
  laboratorioId: z.string().min(1, { message: "Requerido" }),
  equipoRequerido: z.array(inputEquipoReservado).default([]),
  equipoReservado: z.array(inputEquipoReservado).default([]),
});

export const inputEditarReservaLaboratorioCerradoSchema = z
  .object({
    id: z.number().positive().min(1, { message: "Requerido" }),
  })
  .merge(inputReservaLaboratorioCerrado);

export const inputGetAllSolicitudesReservaLaboratorioCerrado = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("20").catch("20"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum([
      "id",
      "laboratorioId",
      "sede",
      "reserva_usuarioSolicito_apellido",
      "reserva_fechaHoraInicio",
      "reserva_fechaHoraFin",
    ])
    .default("reserva_fechaHoraInicio")
    .catch("reserva_fechaHoraInicio"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
  estatus: enumReservaEstatus.default("").catch(""),
  filtrByUserId: z.enum(["true", "false"]).optional(),
  pasadas: z.enum(["true", "false"]).optional(),
  aprobadas: z.enum(["true", "false"]).optional(),
});

export const inputRechazarReservaLaboratorioCerrado = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  motivo: z.string().min(1, { message: "Requerido" }),
});
