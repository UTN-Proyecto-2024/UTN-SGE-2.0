"use client";

import { useRouter } from "next/navigation";
import { CursoForm } from "./curso-form";
import { CURSOS_ROUTE } from "@/shared/server-routes";
import { api } from "@/trpc/react";

type PageProps = {
  params: { id?: string };
};

const cursoRuta = CURSOS_ROUTE;

export default function PageCursosDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const utils = api.useUtils();
  const refreshGetAll = () => {
    utils.cursos.getAll.invalidate().catch((err) => {
      console.error(err);
    });
  };

  const handleClickCancel = () => {
    refreshGetAll();
    router.push(cursoRuta.href);
  };

  const handleClickSave = () => router.push(cursoRuta.href);

  return (
    <>
      <CursoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}
