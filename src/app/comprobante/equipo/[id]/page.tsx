"use server";

import ComprobanteContent from "../../_components/comprobante-prestamo";
import { api } from "@/trpc/server";

type PageProps = {
  params: { id?: string };
};

export default async function ComprobantePage({ params: { id } }: PageProps) {
  const datosReserva = await api.reservas.reservaEquipo.getReservaPorId({ id: Number(id) });

  return <ComprobanteContent datosEquipo={datosReserva} datosLibro={undefined} />;
}
