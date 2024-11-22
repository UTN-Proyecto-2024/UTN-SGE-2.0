import { inputGetAllLaboratorios } from "@/shared/filters/laboratorio-filter.schema";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { getAllReservasToday } from "../../repositories/reservas/reserva.repository";
import { calcularTurnoTexto } from "@/shared/get-date";

// type Reserva = {
//   id: number;
//   tipo: string;
//   laboratorio: string;
//   descripcion: string;
//   sede: string;
//   equipos: string[];
//   division: string;
//   materia: string;
//   profesor: string | null;
//   // fechaHoraInicio: Date;
//   // fechaHoraFin: Date;
// };

export const getReservasToday = protectedProcedure.input(inputGetAllLaboratorios).query(async ({ ctx, input }) => {
  validarInput(inputGetAllLaboratorios, input);
  const reservas = await getAllReservasToday(ctx, input);

  const reservasMaped = reservas
    .map((reserva) => ({
      fechaHoraInicio: reserva.fechaHoraInicio,
      fechaHoraFin: reserva.fechaHoraFin,
      turnoTexto: calcularTurnoTexto(reserva.fechaHoraInicio),
      ...(reserva.reservaLaboratorioCerrado && {
        id: reserva.reservaLaboratorioCerrado.id,
        tipo: "CERRADO",
        laboratorio: reserva.reservaLaboratorioCerrado.laboratorio?.nombre,
        descripcion: reserva.reservaLaboratorioCerrado.descripcion,
        equipos: reserva.reservaLaboratorioCerrado.equipoReservado
          .map((equipo) => `${equipo.cantidad} ${equipo.equipoTipo.nombre}`)
          .concat([
            ...(reserva.reservaLaboratorioCerrado.requierePC ? [`1 PC`] : []),
            ...(reserva.reservaLaboratorioCerrado.requiereProyector ? [`1 Proyector`] : []),
          ]),
        sede: reserva.reservaLaboratorioCerrado.sede?.nombre,
        division: reserva.reservaLaboratorioCerrado.curso?.division.nombre,
        materia: reserva.reservaLaboratorioCerrado.curso?.materia.nombre,
        profesor:
          reserva.reservaLaboratorioCerrado.curso &&
          `${reserva.reservaLaboratorioCerrado.curso?.profesor.nombre} ${reserva.reservaLaboratorioCerrado.curso?.profesor.apellido}`,
      }),
      ...(reserva.reservaLaboratorioAbierto && {
        id: reserva.reservaLaboratorioAbierto.id,
        tipo: reserva.reservaLaboratorioAbierto.laboratorioAbiertoTipo,
        laboratorio: reserva.reservaLaboratorioAbierto.laboratorio?.nombre,
        reserva: reserva.reservaLaboratorioAbierto.descripcion,
        equipos: reserva.reservaLaboratorioAbierto.equipoReservado.map(
          (equipo) => `${equipo.cantidad} ${equipo.equipoTipo.nombre}`,
        ),
        sede: reserva.reservaLaboratorioAbierto.sede?.nombre,
        profesor: reserva.usuarioTutor && `${reserva.usuarioTutor.nombre} ${reserva.usuarioTutor.apellido}`,
      }),
    }))
    .filter((reserva) => reserva.laboratorio);

  return reservasMaped;
});
