import { z } from "zod";

export const inputGetReservaEquipoPorUsuarioId = z.object({
  id: z.string().min(1),
});

export const inputGetReservasEquiposPorEquipoId = z.object({
  equipoId: z.number().positive().min(1, { message: "Requerido" }),
});

export const inputGetAllPrestamosEquipos = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum([
      "id",
      "equipo_inventarioId",
      "reserva_usuarioSolicito_apellido",
      "reserva_fechaHoraInicio",
      "reserva_fechaHoraFin",
      "reserva_usuarioAprobador_apellido",
      "reserva_usuarioRenovo_apellido",
      "reserva_usuarioRecibio_apellido",
    ])
    .default("id")
    .catch("id"),
  orderDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  searchText: z.string().default(""),
  estatus: z.enum(["PENDIENTE", "FINALIZADA", "CANCELADA", ""]).default("").catch(""),
  userId: z.string().optional(),
});

export const inputPrestarEquipo = z
  .object({
    equipoId: z.number().positive().min(1, { message: "Requerido" }),
    usuarioSolicitanteId: z.string().optional(),
    fechaInicio: z.string().min(1, { message: "Requerido" }),
    fechaFin: z.string().min(1, { message: "Requerido" }),
  })
  .superRefine(({ fechaInicio, fechaFin }, ctx) => {
    const date1 = new Date(fechaInicio);
    const date2 = new Date(fechaFin);

    if (date1 > date2) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: "La fecha de inicio debe ser menor a la de fin",
        path: ["fechaInicio"],
      });

      return z.NEVER;
    }
  });