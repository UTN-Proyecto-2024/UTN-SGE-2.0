"use client";

import { useEffect } from "react";
import { UTNLogo } from "@/app/_components/utn-logo";
import { type RouterOutputs } from "@/trpc/react";
import { getFechaHumanoTexto } from "@/shared/get-date";

type DataReservaLibro = RouterOutputs["reservas"]["reservaBiblioteca"]["getReservaPorId"];

type ComprobanteContentProps = {
  datos: DataReservaLibro;
};

export default function ComprobanteContent({ datos: datosReserva }: ComprobanteContentProps) {
  useEffect(() => {
    if (!datosReserva) return;

    window.print();
  }, [datosReserva]);

  const prestamoFechaFinHumano = getFechaHumanoTexto(datosReserva?.fechaHoraFin);

  if (!datosReserva) return null;

  return (
    <section className="mx-auto flex h-[297mm] w-[210mm] flex-col justify-around gap-y-4 overflow-hidden px-8 py-2">
      {/* Titulo */}
      <div className="flex-initial items-center justify-between">
        <UTNLogo className="h-7" />
        <h3 className="text-center text-2xl font-bold">
          Préstamo de Libro #{datosReserva.reservaLibro?.libro.id} - {datosReserva.id}
        </h3>
      </div>

      {/* Datos del Alumno / Datos del Libro */}
      <div className="flex w-full flex-initial flex-row space-x-4">
        <div className="h-full basis-1/2 border border-gray-800 p-2">
          <div className="flex h-full flex-col justify-between text-left">
            <h3 className="text-center text-lg font-bold">Datos del Alumno</h3>
            <p>
              Apellido y Nombre: {datosReserva.usuarioSolicito.apellido}, {datosReserva.usuarioSolicito.nombre}
            </p>
            <p>Número de Legajo: {datosReserva.usuarioSolicito.legajo}</p>
            <div className="flex w-full flex-row justify-between">
              <span>T: {datosReserva.usuarioSolicito.telefonoCasa ?? "---"}</span>
              <span>C: {datosReserva.usuarioSolicito.telefonoCelular ?? "---"}</span>
              <span>L: {datosReserva.usuarioSolicito.telefonoLaboral ?? "---"}</span>
            </div>
          </div>
        </div>
        <div className="basis-1/2 border border-gray-800 p-2">
          <div className="flex h-full flex-col justify-between text-left">
            <h3 className="text-center text-lg font-semibold">Datos del Libro</h3>
            <div className="text-left">
              <p>Título: {datosReserva.reservaLibro?.libro.titulo}</p>
              <p>Editorial: {datosReserva.reservaLibro?.libro.editorial.editorial}</p>
              <p>Número de inventario: {datosReserva.reservaLibro?.libro.inventarioId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Datos del Préstamo */}
      <div className="w-full flex-1 border border-gray-800 p-3">
        <div className="flex h-full flex-col justify-between">
          <div>
            <h3 className="text-center text-lg font-semibold">Datos del Préstamo</h3>
            <p className="mt-2 text-justify text-sm">
              Recibí el libro descrito, en perfeto estado de conservación, y en concepto de prestamos. Me comprometo a
              hacer buen uso del mismo y devolverlo antes del{" "}
              <span className="underline">{prestamoFechaFinHumano}</span>. De requerir una extensión de plazo, me
              comprometo a presentarme en el departamento de electrónica a los efectos de solicitar la renovación
              correspondiente. Asi mismo delcaro que mi datos personales figuran correctamente.
            </p>
          </div>
          <div>
            <div className="flex flex-row justify-between text-sm">
              <span>
                Préstamo Realizado por{" "}
                <span className="font-bold">
                  {datosReserva.usuarioAprobador?.nombre} {datosReserva.usuarioAprobador?.apellido}
                </span>
              </span>
              <p className="overline">Firma y Aclaración</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancelación del Préstamo */}
      <div className="w-full flex-1 border border-gray-800 p-3">
        <div className="flex h-full flex-col justify-between">
          <div className="w-full">
            <div>
              <h3 className="text-center text-lg font-semibold">Cancelación del Préstamo</h3>
            </div>
            <div className="flex  justify-between">
              <p className="underline">Observaciones:</p>
              <p>
                <span className="underline">Fecha:</span> ___/___/______
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="me-1 mt-1 text-sm font-semibold">
              Yo _______________________, declaro recibir el libro anteriormente descrito
            </p>
            <p className="overline">Firma y Aclaración</p>
          </div>
        </div>
      </div>

      {/* Renovación del Préstamo */}
      <div className="w-full flex-1 border border-gray-800 p-3">
        <div className="flex h-full flex-col justify-between">
          <div className="w-full">
            <div>
              <h3 className="text-center text-lg font-semibold">Renovación del Préstamo</h3>
            </div>
            <div className="mt-4 flex  justify-between">
              <p className="underline">Observaciones:</p>
              <p>
                <span className="underline">Fecha:</span> ___/___/______
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <p className="mt-1 text-sm font-semibold">Libro renovado hasta la fecha ____/___/______</p>
            <p className="overline">Firma y Aclaración</p>
          </div>
        </div>
      </div>

      {/* Renovación del Préstamo */}
      <div className="w-full flex-1 border border-gray-800 p-3">
        <div className="flex h-full flex-col justify-between">
          <div className="w-full">
            <div>
              <h3 className="text-center text-lg font-semibold">Renovación del Préstamo</h3>
            </div>
            <div className="mt-4 flex  justify-between">
              <p className="underline">Observaciones:</p>
              <p>
                <span className="underline">Fecha:</span> ___/___/______
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <p className="mt-1 text-sm font-semibold">Libro renovado hasta la fecha ____/___/______</p>
            <p className="overline"> Firma y Aclaración </p>
          </div>
        </div>
      </div>
    </section>
  );
}
