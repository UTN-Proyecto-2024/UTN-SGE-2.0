import { api } from "@/trpc/server";
import { DivisionesTable } from "./table";
import type { inputGetDivisiones } from "@/shared/filters/divisiones-filter.schema";
import type { z } from "zod";

type DivisionesFilters = z.infer<typeof inputGetDivisiones>;

export default async function DivisionesTableContainer({ filters }: { filters: DivisionesFilters }) {
  const data = await api.division.getFiltered(filters);
  return <DivisionesTable data={data} />;
}
