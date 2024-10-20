"use client";

import React from "react";
import { type z } from "zod";
import { useAdminUsuariosQueryParam } from "../../_hooks/use-admin-usuarios-query-param";
import { RolesSelector } from "./roles-selector";
import { type inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";

type AdminUsuariosFilters = z.infer<typeof inputGetUsuarios>;

type Props = {
  filters: AdminUsuariosFilters;
};

export const AdminUsuariosFilterRol = ({ filters }: Props) => {
  const { rol, onRolChange } = useAdminUsuariosQueryParam(filters);

  return (
    <>
      <RolesSelector onRolChange={onRolChange} currentRolId={Number(rol)} />
    </>
  );
};
