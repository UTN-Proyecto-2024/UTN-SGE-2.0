import {
  agregarReservaPantallaProcedure,
  getReservasEnPntallaActivasProcedure,
  removerReservaPantallaProcedure,
} from "../../services/reservas/pantalla.service";
import { createTRPCRouter } from "../../trpc";

export const pantallaRouter = createTRPCRouter({
  getAllActivas: getReservasEnPntallaActivasProcedure,
  eliminarReservaPantalla: removerReservaPantallaProcedure,
  agregarReservaPantalla: agregarReservaPantallaProcedure,
});
