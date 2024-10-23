import {
  getReservasEnPantalla,
  removerReservaPantalla,
  crearReservaPantalla,
} from "../../repositories/reservas/pantalla.repository";
import { protectedProcedure } from "../../trpc";
import {
  inputAgregarReservaPantalla,
  inputEliminarReservaPantallas,
  inputGetReservasEnPntallaActivas,
} from "@/shared/filters/reserva-pantalla-filter.schema";
import { validarInput } from "../helper";

export const getReservasEnPntallaActivasProcedure = protectedProcedure
  .input(inputGetReservasEnPntallaActivas)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservasEnPntallaActivas, input);

    const reservas = await getReservasEnPantalla(ctx, input);

    return reservas;
  });

export const removerReservaPantallaProcedure = protectedProcedure
  .input(inputEliminarReservaPantallas)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEliminarReservaPantallas, input);

    const reservasPantallaEliminadas = await removerReservaPantalla(ctx, input);

    return reservasPantallaEliminadas;
  });

export const agregarReservaPantallaProcedure = protectedProcedure
  .input(inputAgregarReservaPantalla)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputAgregarReservaPantalla, input);

    const userId = ctx.session.user.id;

    const reservaPantallaCreada = await crearReservaPantalla(ctx, input, userId);

    return reservaPantallaCreada;
  });
