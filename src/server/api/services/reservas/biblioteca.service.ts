import { protectedProcedure } from "../../trpc";
import {
  crearPrestamoLibro,
  devolverLibro,
  getAllReservas,
  getReservaPorUsuarioId,
  renovarLibro,
  verReservasDeLibro,
} from "@/server/api/repositories/reservas/biblioteca.repository";
import { validarInput } from "@/server/api/services/helper";
import {
  inputGetAllPrestamosLibros,
  inputGetReservaLibroPorUsuarioId,
  inputGetReservasLibroPorLibroId,
  inputPrestarLibro,
} from "@/shared/filters/reservas-filter.schema";
import {
  enviarMailReservaLibroProcedure,
  enviarMailRenovarLibroProcedure,
  enviarMailDevolverLibroProcedure,
} from "../mails/emailBiblioteca.service";

export const getTodasLasReservasProcedure = protectedProcedure
  .input(inputGetAllPrestamosLibros)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetAllPrestamosLibros, input);

    const userId = ctx.session.user.id;

    const reservas = await getAllReservas(ctx, input, userId);

    return reservas;
  });

export const getReservaLibroPorUserProcedure = protectedProcedure
  .input(inputGetReservaLibroPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaLibroPorUsuarioId, input);

    const reserva = await getReservaPorUsuarioId(ctx, input);

    return reserva;
  });

export const crearPrestamoLibroProcedure = protectedProcedure
  .input(inputPrestarLibro)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputPrestarLibro, input);

    const userId = ctx.session.user.id;

    const reserva = await crearPrestamoLibro(ctx, input, userId);

    void enviarMailReservaLibroProcedure(ctx, { reservaId: reserva.id });

    return reserva;
  });

export const verReservasProcedure = protectedProcedure
  .input(inputGetReservasLibroPorLibroId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservasLibroPorLibroId, input);

    const reservas = await verReservasDeLibro(ctx, input);

    return reservas;
  });

export const devolverLibroProcedure = protectedProcedure
  .input(inputGetReservasLibroPorLibroId)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputGetReservasLibroPorLibroId, input);

    const userId = ctx.session.user.id;

    const reserva = await devolverLibro(ctx, input, userId);

    void enviarMailDevolverLibroProcedure(ctx, input, userId);

    return reserva;
  });

export const renovarLibroProcedure = protectedProcedure.input(inputPrestarLibro).mutation(async ({ ctx, input }) => {
  validarInput(inputPrestarLibro, input);

  const userId = ctx.session.user.id;

  const reserva = await renovarLibro(ctx, input, userId);

  void enviarMailRenovarLibroProcedure(ctx, input, userId);

  return reserva;
});
