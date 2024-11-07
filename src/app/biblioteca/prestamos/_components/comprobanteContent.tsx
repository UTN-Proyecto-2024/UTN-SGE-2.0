"use client";

import { useEffect, useRef } from "react";

type ComprobanteContentProps = {
  datos: object;
};

export default function ComprobanteContent({ datos }: ComprobanteContentProps) {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePrint = () => {
      if (printRef.current) {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
      }
    };

    handlePrint();
  }, []);

  useEffect(() => {
    console.log("Datos en ComprobanteContent:", datos);
  }, [datos]);
  return (
    <div ref={printRef}>
      <section className="mx-auto h-[500px] max-w-3xl p-2">
        <div className="mb-2 text-center">
          <h1 className="text-lg font-bold">Préstamo de Libro #333 - 45</h1>
          <div className="mt-4 flex flex-wrap justify-around">
            <div className="w-5/12 border border-gray-800 p-2">
              <h3 className="text-sm font-semibold">Datos del Alumno</h3>
              <div className="text-left">
                <p className="underline">Apellido y Nombre:</p>
                <p className="underline">Número de Legajo:</p>
                <span className="underline">T:</span>
                <span className="ml-2 underline">C:</span>
                <span className="ml-2 underline">L:</span>
              </div>
            </div>
            <div className="w-5/12 border border-gray-800 p-2">
              <h3 className="text-sm font-semibold">Datos del Libro</h3>
              <div className="text-left">
                <p className="underline">Título:</p>
                <p className="underline">Editorial:</p>
                <p className="underline">Número de inventario:</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto my-3 w-11/12 border border-gray-800 p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold">Datos del Préstamo</h3>
              <p className="mt-2 text-justify text-sm">
                Recibí el libro descrito, en perfeto estado de conservaación, y en concepto de prestamos. Me comprometo
                a hacer buen uso del mismo y devolverlo antes de la fecha limite. De requerir una extensión de plazo, me
                comprometo a presentarme en el departamento de electrónica a los efectos de solicitar la renovación
                correspondiente. Asi mismo delcaro que mi datos personales figuran correctamente.
              </p>
            </div>
            <p className="mt-10 text-sm font-semibold">
              Préstamo Realizado por <span className="font-bold">Usuario</span>.
            </p>
          </div>
        </div>

        <div className="mx-auto my-3 h-[185px] w-11/12 border border-gray-800 p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-center text-sm font-semibold">Cancelación del Préstamo</h3>
            </div>
            <div className="mt-4 flex w-4/5 justify-between">
              <p>Observaciones:</p>
              <p className="underline">Fecha: / /</p>
            </div>
            <div className="mt-5 flex items-center justify-around">
              <p className="mt-1 font-semibold">
                Yo, <span className="ml-4 underline">Declaro recibir el libro anteriormente descrito.</span>
              </p>
              <p className="mt-16 overline">Firma y Aclaración</p>
            </div>
          </div>
        </div>

        <div className="mx-auto my-3 h-[185px] w-11/12 border border-gray-800 p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-center text-sm font-semibold">Renovación del Préstamo</h3>
            </div>
            <div className="mt-4 flex w-4/5 justify-between">
              <p>Observaciones:</p>
              <p className="underline">Fecha: / /</p>
            </div>
            <div className="mt-5 flex items-center justify-around">
              <p className="mt-1 font-semibold">
                Yo, <span className="ml-4 underline">Declaro recibir el libro anteriormente descrito.</span>
              </p>
              <p className="mt-16 overline">Firma y Aclaración</p>
            </div>
          </div>
        </div>

        <div className="mx-auto my-3 h-[185px] w-11/12 border border-gray-800 p-3">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-center text-sm font-semibold">Renovación del Préstamo</h3>
            </div>
            <div className="mt-4 flex w-4/5 justify-between">
              <p>Observaciones:</p>
              <p className="underline">Fecha: / /</p>
            </div>
            <div className="mt-5 flex items-center justify-around">
              <p className="mt-1 font-semibold">
                Yo, <span className="ml-4 underline">Declaro recibir el libro anteriormente descrito.</span>
              </p>
              <p className="mt-16 overline">Firma y Aclaración</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
