"use client";

import { type RouterOutputs } from "@/trpc/react";

import { ContenedorPrint } from "../../_components/contenedor-print";
import { DatosSolicitante } from "../../_components/datos-alumno";
import { DatosReserva } from "../../_components/datos-reserva";

type DataReservaLaboAbierto = RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getReservaPorID"];

export default function ComprobanteLaboratorioAbierto({ datos }: { datos: DataReservaLaboAbierto }) {
  if (!datos) return null;

  return (
    <ContenedorPrint
      titulo={`Reserva de Laboratorio Abierto - ${datos.laboratorioAbiertoTipo} N°: ${datos.reserva.id}`}
    >
      {/* Datos del Alumno / Datos del Libro - Inventario */}
      <div className="flex w-full flex-initial flex-row space-x-4">
        <DatosSolicitante datosUsuario={datos.reserva.usuarioSolicito} />
        <DatosReserva
          fechaHoraInicio={datos.reserva.fechaHoraInicio}
          fechaHoraFin={datos.reserva.fechaHoraFin}
          cantidadPersonas={datos.concurrentes}
        />
      </div>
    </ContenedorPrint>
  );
}
