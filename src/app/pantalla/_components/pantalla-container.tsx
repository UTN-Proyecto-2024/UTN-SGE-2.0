"use client";

import { UTNLogo } from "@/app/_components/utn-logo";
import { getTimeISOString } from "@/shared/get-date";
import { api, type RouterInputs } from "@/trpc/react";
import { useEffect } from "react";

type PantallaInput = RouterInputs["reservas"]["pantalla"]["getAllActivas"];

type PantallaTableContainerProps = {
  filters: PantallaInput;
};

export const PantallaTableContainer = (props: PantallaTableContainerProps) => {
  const { data } = api.reservas.pantalla.getAllActivas.useQuery({ ...props.filters });

  const currentDate = new Date();

  return (
    <main className="flex flex-col">
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
      <code>{JSON.stringify(data, null, 4)}</code>
    </main>
  );
};
