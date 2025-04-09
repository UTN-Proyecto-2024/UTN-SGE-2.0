"use client";

import { useRouter } from "next/navigation";
import { LibroForm } from "./libro-form";

export default function DetalleLibro({ id }: { id: string }) {
  const router = useRouter();

  const handleClickCancel = () => router.back();

  const handleClickSave = () => router.push("/biblioteca");

  return <LibroForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />;
}
