"use client";

import { api } from "@/trpc/react";
import { type z } from "zod";
import { AdminUsuariosTable } from "./roles-table";
import { type inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";
import LoadingAdminTable from "./loading-admin-table";

type UsuariosFilters = z.infer<typeof inputGetUsuarios>;

type Props = {
  filters: UsuariosFilters;
};

// TODO @Alex: Va a ser mejor convertir todos estos componentes de tablas en `use client` porque asi TRPC podrá invalidar los hooks y hacer queries desde los modals
export default function AdminUsuariosTableContainer({ filters }: Props) {
  const { data: usuarios, isLoading } = api.admin.usuarios.getAll.useQuery(filters);

  if (isLoading) {
    return LoadingAdminTable;
  }

  return <AdminUsuariosTable data={usuarios ?? { count: 0, usuarios: [] }} filters={filters} />;
}
