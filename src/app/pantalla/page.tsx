import { type ReadonlyURLSearchParams } from "next/navigation";
import React from "react";
import { PantallaTableContainer } from "./_components/pantalla-container";
import { inputGetReservasEnPntallaActivas } from "@/shared/filters/reserva-pantalla-filter.schema";

type PageProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default function Page({ searchParams }: PageProps) {
  const filters = inputGetReservasEnPntallaActivas.parse(searchParams);

  return <PantallaTableContainer filters={filters} />;
}
