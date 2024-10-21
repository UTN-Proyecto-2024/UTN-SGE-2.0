import { api } from "@/trpc/server";
import { PantallaTable } from "./pantalla-table";

export default async function PantallaTableContainer() {
  const reservasEnPantalla = await api.reservas.pantalla.getAllActivas({});

  return <PantallaTable data={reservasEnPantalla} />;
}
