"use client";

import { api } from "@/trpc/react";
import { type z } from "zod";
import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { RolesTable } from "./roles-table";
import LoadingAdminTable from "./loading-admin-table";

type RolesFilters = z.infer<typeof inputGetRoles>;

type LaboratoriosTableContainerProps = {
  filters: RolesFilters;
};

// TODO @Alex: Va a ser mejor convertir todos estos componentes de tablas en `use client` porque asi TRPC podrá invalidar los hooks y hacer queries desde los modals
export default function RolesTableContainer({ filters }: LaboratoriosTableContainerProps) {
  const { data: roles, isLoading } = api.admin.roles.getAllRoles.useQuery(filters);

  if (isLoading) {
    return LoadingAdminTable;
  }

  return <RolesTable data={roles ?? { count: 0, roles: [] }} filters={filters} />;
}
