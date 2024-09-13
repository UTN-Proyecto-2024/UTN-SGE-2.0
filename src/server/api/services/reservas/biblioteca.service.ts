import { protectedProcedure } from "../../trpc";
import {
  crearPrestamoLibro,
  devolverLibro,
  getReservaPorUsuarioId,
  verReservasDeLibro,
} from "@/server/api/repositories/reservas/biblioteca.repository";
import { validarInput } from "@/server/api/services/helper";
import {
  inputGetReservaLibroPorUsuarioId,
  inputGetReservasLibroPorLibroId,
  inputPrestarLibro,
} from "@/shared/filters/reservas-filter.schema";

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

    return reserva;
  });