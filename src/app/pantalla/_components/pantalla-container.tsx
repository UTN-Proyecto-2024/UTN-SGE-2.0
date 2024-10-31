"use client";

import { UTNLogo } from "@/app/_components/utn-logo";
import { getTimeISOString } from "@/shared/get-date";
import { api, type RouterInputs } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import "./pantalla.css";

type PantallaInput = RouterInputs["reservas"]["pantalla"]["getAllActivas"];

type PantallaTableContainerProps = {
  filters: PantallaInput;
};

export const PantallaTableContainer = (props: PantallaTableContainerProps) => {
  const { data, isLoading } = api.reservas.pantalla.getAllActivas.useQuery(
    { ...props.filters },
    { refetchInterval: 1000 * 60 },
  );

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  const currentDate = new Date();

  return (
    <div className="flex h-screen flex-col">
      <nav className="flex h-40 flex-row justify-between bg-[#252B31] px-8 py-3 text-6xl text-white">
        <div className="flex w-full flex-col justify-center">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-x-2">
              <UTNLogo className="h-14 invert" />
              <div className="h-14 border-l-2 border-solid border-white pl-2">UTN</div>
            </div>

            <div className="flex flex-row gap-x-2">{getTimeISOString(currentDate)}</div>
          </div>
        </div>
      </nav>

      <div className="flex h-full w-full flex-col bg-[#FAFAFA] p-8 text-2xl">
        <Card className="w-full bg-[#FFFFFF]">
          <CardContent className="table-container p-2">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-[#F6F7F9]">
                  <th className="px-4 py-4 text-center font-semibold text-gray-600">Materia</th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-600">Laboratorio</th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-600">Docente</th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-600">Comienzo</th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((reserva) => {
                  return (
                    <tr className="rounded-lg  bg-white" key={reserva.id}>
                      <td className="rounded-l-lg px-4 py-2 text-center">
                        {reserva.materia && reserva.materia?.trim().length > 0 ? reserva.materia : "Sin informar"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <a href="#" className="font-semibold text-blue-600">
                          {reserva.laboratorio}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {reserva.docente && reserva.docente?.trim().length > 0 ? reserva.docente : "Sin informar"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="w-full rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-600">
                          {getTimeISOString(reserva.fechaHoraInicio)}
                        </div>
                      </td>
                      <td className="rounded-r-lg px-4 py-2 text-center">
                        <div className="w-full rounded-full bg-green-100 px-3 py-1 font-semibold text-green-600">
                          Activo
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
