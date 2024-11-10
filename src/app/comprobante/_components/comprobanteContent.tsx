"use client";

import { useEffect, useRef } from "react";
import { UTNLogo } from "@/app/_components/utn-logo";
import { type RouterOutputs } from "@/trpc/react";

type DataReservaLibro = RouterOutputs["reservas"]["reservaBiblioteca"]["getReservaPorId"];

type ComprobanteContentProps = {
  datos: DataReservaLibro;
};

export default function ComprobanteContent({ datos: datosReserva }: ComprobanteContentProps) {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePrint = () => {
      if (printRef.current) {
        const printContents = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContent;
      }
    };

    handlePrint();
  }, []);

  const fechaHoraFin = datosReserva?.fechaHoraFin ? new Date(datosReserva?.fechaHoraFin) : null;
  const fechaFormateada = fechaHoraFin
    ? `${fechaHoraFin.getDate().toString().padStart(2, "0")}/${(fechaHoraFin.getMonth() + 1).toString().padStart(2, "0")}/${fechaHoraFin.getFullYear()}`
    : "";

  const datosReservaToForm = {
    id: JSON.stringify(datosReserva?.id),
    nombre: JSON.stringify(datosReserva?.usuarioSolicito?.nombre),
    apellido: JSON.stringify(datosReserva?.usuarioSolicito?.apellido),
    email: JSON.stringify(datosReserva?.usuarioSolicito?.email),
    nLegajo: JSON.stringify(datosReserva?.usuarioSolicito?.legajo),
    tituloLibro: JSON.stringify(datosReserva?.reservaLibro?.libro?.titulo),
    editorial: JSON.stringify(datosReserva?.reservaLibro?.libro?.editorialId),
    inventario: JSON.stringify(datosReserva?.reservaLibro?.libro?.inventarioId),
    nombreAprobador: JSON.stringify(datosReserva?.usuarioAprobador?.nombre),
    apellidoAprobador: JSON.stringify(datosReserva?.usuarioAprobador?.apellido),
    prestamoFechaFin: fechaFormateada,
  };
  return (
    <div ref={printRef}>
      <section className="mx-auto h-[500px] max-w-3xl p-2">
        <div className="mb-2">
          <div className="d-flex flex-row items-center justify-between">
            <UTNLogo className="h-7" />
            <h3 className="text-center text-lg font-bold"> Préstamo de Libro #{datosReservaToForm.id}</h3>
          </div>
          <div className="mt-4 flex flex-wrap justify-around">
            <div className="w-6/12 border border-gray-800 p-2">
              <h3 className="text-sm font-semibold">Datos del Alumno</h3>
              <div className="text-left">
                <p>
                  Apellido y Nombre:{" "}
                  <span>
                    {datosReservaToForm.nombre} {datosReservaToForm.apellido}
                  </span>
                </p>
                <p>Número de Legajo: -</p>
                <span>T:</span>
                <span className="ml-2">C:</span>
                <span className="ml-2">L:{datosReservaToForm.email}</span>
              </div>
            </div>
            <div className="w-6/12 border border-gray-800 p-2">
              <h3 className="text-sm font-semibold">Datos del Libro</h3>
              <div className="text-left">
                <p>Título: {datosReservaToForm.tituloLibro}</p>
                <p>Editorial: {datosReservaToForm.editorial}</p>
                <p>Número de inventario: {datosReservaToForm.inventario}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-12/12 mx-auto my-3 border border-gray-800 p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold">Datos del Préstamo</h3>
              <p className="mt-2 text-justify text-sm">
                Recibí el libro descrito, en perfeto estado de conservación, y en concepto de prestamos. Me comprometo a
                hacer buen uso del mismo y devolverlo antes del {datosReservaToForm.prestamoFechaFin}. De requerir una
                extensión de plazo, me comprometo a presentarme en el departamento de electrónica a los efectos de
                solicitar la renovación correspondiente. Asi mismo delcaro que mi datos personales figuran
                correctamente.
              </p>
            </div>
            <p className="mt-10 text-sm font-semibold">
              Préstamo Realizado por{" "}
              <span className="font-bold">
                {datosReservaToForm.nombreAprobador} {datosReservaToForm.apellidoAprobador}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="w-12/12 mx-auto my-3 h-[185px] border border-gray-800 p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-center text-sm font-semibold">Cancelación del Préstamo</h3>
            </div>
            <div className="mt-4 flex w-4/5 justify-between">
              <p>Observaciones:</p>
              <p className="underline">Fecha: / /</p>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <p className="me-1 mt-1 font-semibold">
                Yo,{datosReservaToForm.nombre} {datosReservaToForm.apellido}
                <span> Declaro recibir el libro anteriormente descrito.</span>
              </p>
              <p className="mt-16 overline">Firma y Aclaración</p>
            </div>
          </div>
        </div>

        <div className="w-12/12 mx-auto my-3 h-[185px] border border-gray-800 p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-center text-sm font-semibold">Renovación del Préstamo</h3>
            </div>
            <div className="mt-4 flex w-4/5 justify-between">
              <p>Observaciones:</p>
              <p className="underline">Fecha: / /</p>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <p className="mt-1 font-semibold">
                Yo,{datosReservaToForm.nombre} {datosReservaToForm.apellido}{" "}
                <span>Declaro recibir el libro anteriormente descrito.</span>
              </p>
              <p className="mt-16 overline">Firma y Aclaración</p>
            </div>
          </div>
        </div>

        <div className="w-12/12 mx-auto my-3 h-[185px] border border-gray-800 p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-center text-sm font-semibold">Renovación del Préstamo</h3>
            </div>
            <div className="mt-4 flex w-4/5 justify-between">
              <p>Observaciones:</p>
              <p className="underline">Fecha: / /</p>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <p className="mt-1 font-semibold">
                Yo,{datosReservaToForm.nombre} {datosReservaToForm.apellido}{" "}
                <span>Declaro recibir el libro anteriormente descrito.</span>
              </p>
              <p className="mt-16 overline">Firma y Aclaración</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
