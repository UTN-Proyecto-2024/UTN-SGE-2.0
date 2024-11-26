"use client";

import { useRouter } from "next/navigation";
import { EquipoForm } from "./equipo-form";
import { api } from "@/trpc/react";

type PageProps = {
  params: { id?: string };
};

export default function PageEquipoDetails({ params: { id } }: PageProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const refreshGetAll = () => {
    utils.equipos.getAll.invalidate().catch((err) => {
      console.error(err);
    });
  };

  const handleClickCancel = () => router.back();

  const handleClickSave = () => {
    refreshGetAll();
    router.back();
  };

  return (
    <>
      <EquipoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}
