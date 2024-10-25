import { inputGetReservaPorUsuarioId } from "@/shared/filters/reservas-filter.schema";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { devolverEquipo, getReservaPorUsuarioId, renovarEquipo } from "../../repositories/reservas/equipo.repository";
import {
  enviarMailDevolverEquipoProcedure,
  enviarMailReservaEquipoProcedure,
  enviarMailRenovarEquipoProcedure,
} from "../mails/emailEquipos.service";
import {
  inputGetReservasEquiposPorEquipoId,
  inputPrestarEquipo,
} from "@/shared/filters/reservas-equipos-filter.schema";

export const getReservaEquipoPorUserProcedure = protectedProcedure
  .input(inputGetReservaPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaPorUsuarioId, input);

    const reservas = await getReservaPorUsuarioId(ctx, input);

    void enviarMailReservaEquipoProcedure(ctx, Number(input.id));
    return reservas;
  });

export const devolverEquipoProcedure = protectedProcedure
  .input(inputGetReservasEquiposPorEquipoId)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputGetReservasEquiposPorEquipoId, input);

    const userId = ctx.session.user.id;

    const reserva = await devolverEquipo(ctx, input, userId);

    void enviarMailDevolverEquipoProcedure(ctx, input, userId);

    return reserva;
  });

export const renovarEquipoProcedure = protectedProcedure.input(inputPrestarEquipo).mutation(async ({ ctx, input }) => {
  validarInput(inputPrestarEquipo, input);

  const userId = ctx.session.user.id;

  const reserva = await renovarEquipo(ctx, input, userId);

  void enviarMailRenovarEquipoProcedure(ctx, input, userId);

  return reserva;
});
