"use server";

import { api } from "@/trpc/server";
import ComprobanteLaboratorioAbierto from "../_components/comprobante";

type PageProps = {
  params: { id?: string };
};

export default async function ComprobantePage({ params: { id } }: PageProps) {
  const datosReserva = await api.reservas.reservaLaboratorioAbierto.getReservaPorID({ id: Number(id) });

  return <ComprobanteLaboratorioAbierto datos={datosReserva} />;
}
