import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarLaboratorioProcedure,
  eliminarLaboratorioProcedure,
  getLaboratorioPorIdProcedure,
  getTodosLosLaboratoriosProcedure,
  nuevoLaboratorioProcedure,
  getTodosLosSedesProcedure,
  getTodosLosArmariosProcedure,
  getTodosLosEstantesProcedure,
  getTodosLosLaboratoriosConEstadoReservaProcedure,
  getTodosLosLaboratoriosConArmarioProcedure,
} from "../../services/admin/laboratorios-admin.service";

export const laboratoriosRouter = createTRPCRouter({
  getAll: getTodosLosLaboratoriosProcedure,
  getAllConArmarios: getTodosLosLaboratoriosConArmarioProcedure,
  getAllConEstadoReserva: getTodosLosLaboratoriosConEstadoReservaProcedure,
  getAllSedes: getTodosLosSedesProcedure,
  getAllArmarios: getTodosLosArmariosProcedure,
  getAllEstantes: getTodosLosEstantesProcedure,
  getLaboratorioPorId: getLaboratorioPorIdProcedure,
  eliminarLaboratorio: eliminarLaboratorioProcedure,
  editarLaboratorio: editarLaboratorioProcedure,
  nuevoLaboratorio: nuevoLaboratorioProcedure,
});
