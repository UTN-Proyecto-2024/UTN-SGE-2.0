import {
  getReservasEnPantalla,
  removerReservaPantalla,
  crearReservaPantalla,
  getSedePorId,
} from "../../repositories/reservas/pantalla.repository";
import { protectedProcedure, publicProcedure } from "../../trpc";
import {
  inputAgregarReservaPantalla,
  inputEliminarReservaPantallas,
  inputGetReservasEnPntallaActivas,
} from "@/shared/filters/reserva-pantalla-filter.schema";
import { validarInput } from "../helper";
import { verificarPermisos } from "@/server/permisos";
import { SgeNombre } from "@prisma/client";

export const getReservasEnPntallaActivasProcedure = publicProcedure
  .input(inputGetReservasEnPntallaActivas)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservasEnPntallaActivas, input);

    const reservas = await getReservasEnPantalla(ctx, input);

    return reservas;
  });

export const removerReservaPantallaProcedure = protectedProcedure
  .input(inputEliminarReservaPantallas)
  .mutation(async ({ ctx, input }) => {
    await verificarPermisos([SgeNombre.RES_LAB_ABM_PANTALLA]);
    validarInput(inputEliminarReservaPantallas, input);

    const reservasPantallaEliminadas = await removerReservaPantalla(ctx, input);

    return reservasPantallaEliminadas;
  });

export const agregarReservaPantallaProcedure = protectedProcedure
  .input(inputAgregarReservaPantalla)
  .mutation(async ({ ctx, input }) => {
    await verificarPermisos([SgeNombre.RES_LAB_ABM_PANTALLA]);
    validarInput(inputAgregarReservaPantalla, input);

    const userId = ctx.session.user.id;

    const reservaPantallaCreada = await crearReservaPantalla(ctx, input, userId);

    return reservaPantallaCreada;
  });

export const getSedeByIdProcedure = publicProcedure
  .input(inputGetReservasEnPntallaActivas)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservasEnPntallaActivas, input);

    const sede = await getSedePorId(ctx, input);

    return sede;
  });
