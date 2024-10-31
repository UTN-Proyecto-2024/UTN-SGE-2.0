import { api } from "@/trpc/server";
import { SoftwareTable } from "./software-table";
import { type inputGetSoftwareFilter } from "@/shared/filters/laboratorio-filter.schema";
import { type z } from "zod";

type SoftwareFilters = z.infer<typeof inputGetSoftwareFilter>;
type SoftwareTableContainerProps = {
  filters: SoftwareFilters;
};

export default async function SoftwareTableContainer({ filters }: SoftwareTableContainerProps) {
  const softwares = await api.software.getAll(filters);

  return <SoftwareTable data={softwares} filters={filters} />;
}
