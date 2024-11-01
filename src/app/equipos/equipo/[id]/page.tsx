"use client";

import { useRouter } from "next/navigation";
import { EquipoForm } from "./equipo-form";

type PageProps = {
  params: { id?: string };
};

export default function PageEquipoDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  const handleClickSave = () => {
    router.refresh();
    setTimeout(() => router.back(), 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  return (
    <>
      <EquipoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
    </>
  );
}
