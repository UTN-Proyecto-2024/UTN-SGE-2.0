"use client";

import { useEffect } from "react";
import { UTNLogo } from "@/app/_components/utn-logo";
import { type RouterOutputs } from "@/trpc/react";
import { RenovacionPrestamo } from "./renovacion-prestamo";
import { CancelacionPrestamo } from "./cancelacion-prestamo";
import { DatosAlumno } from "./datos-alumno";
import { DatosLibro } from "./datos-libro";
import { DatosPrestamoLibro } from "./datos-prestamo-libro";
import { TituloPrestamo } from "./titulo-prestamo";
import { DatosEquipo } from "./datos-equipo";
import { DatosPrestamoEquipo } from "./datos-prestamo-equipo";

type DataReservaLibro = RouterOutputs["reservas"]["reservaBiblioteca"]["getReservaPorId"];
type DataReservaEquipo = RouterOutputs["reservas"]["reservaEquipo"]["getReservaPorId"];

type ComprobanteContentProps =
  | { datosLibro: DataReservaLibro; datosEquipo: undefined }
  | { datosLibro: undefined; datosEquipo: DataReservaEquipo };

export default function ComprobanteContent({ datosLibro, datosEquipo }: ComprobanteContentProps) {
  useEffect(() => {
    if (!datosLibro && !datosEquipo) return;

    window.print();
  }, [datosLibro, datosEquipo]);

  if (!datosLibro && !datosEquipo) return null;

  const datosGenericos = datosEquipo ?? datosLibro;

  return (
    <section className="mx-auto flex h-[297mm] w-[210mm] flex-col justify-around gap-y-4 overflow-hidden px-8 py-2">
      {/* Titulo */}
      <div className="flex-initial items-center justify-between">
        <UTNLogo className="absolute h-7" />
        <TituloPrestamo
          esLibro={!!datosLibro}
          reservaId={datosGenericos?.id ?? 0}
          inventarioId={
            datosLibro
              ? (datosLibro.reservaLibro?.libro.inventarioId ?? "")
              : datosEquipo
                ? (datosEquipo.reservaEquipo?.equipo.inventarioId ?? "")
                : ""
          }
        />
      </div>

      {/* Datos del Alumno / Datos del Libro - Inventario */}
      <div className="flex w-full flex-initial flex-row space-x-4">
        <DatosAlumno datosUsuario={datosGenericos?.usuarioSolicito} />
        {datosLibro && (
          <DatosLibro
            editorial={datosLibro.reservaLibro?.libro.editorial.editorial ?? ""}
            inventarioId={datosLibro.reservaLibro?.libro.inventarioId ?? ""}
            tituloLibro={datosLibro.reservaLibro?.libro.titulo ?? ""}
          />
        )}
        {datosEquipo && (
          <DatosEquipo
            inventarioId={datosEquipo.reservaEquipo?.equipo.inventarioId ?? ""}
            marca={datosEquipo.reservaEquipo?.equipo.marca.nombre ?? ""}
            tipoInstrumental={datosEquipo.reservaEquipo?.equipo.tipo.nombre ?? ""}
          />
        )}
      </div>

      {/* Datos del Préstamo */}
      {datosLibro && (
        <DatosPrestamoLibro
          fechaHoraFin={datosGenericos?.fechaHoraFin ?? undefined}
          usuarioAprobadorApellido={datosGenericos?.usuarioAprobador?.apellido ?? null}
          usuarioAprobadorNombre={datosGenericos?.usuarioAprobador?.nombre ?? null}
        />
      )}

      {datosEquipo && (
        <DatosPrestamoEquipo
          fechaHoraFin={datosGenericos?.fechaHoraFin ?? undefined}
          usuarioAprobadorApellido={datosGenericos?.usuarioAprobador?.apellido ?? null}
          usuarioAprobadorNombre={datosGenericos?.usuarioAprobador?.nombre ?? null}
        />
      )}

      {/* Cancelación del Préstamo */}
      <CancelacionPrestamo />

      {/* Renovación del Préstamo */}
      <RenovacionPrestamo />

      {/* Renovación del Préstamo */}
      <RenovacionPrestamo />
    </section>
  );
}
