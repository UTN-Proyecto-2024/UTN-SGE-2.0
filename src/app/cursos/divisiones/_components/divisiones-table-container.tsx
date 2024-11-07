import { api } from "@/trpc/server";
import { DivisionesTable } from "./table";

export default async function DivisionesTableContainer() {
  const data = await api.division.getFiltered();
  return <DivisionesTable data={data} />;
}
