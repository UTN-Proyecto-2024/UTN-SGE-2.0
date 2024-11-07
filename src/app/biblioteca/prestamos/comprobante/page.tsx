"use client";
import PageLayout from "@/components/ui/page-template";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";

import ComprobanteContent from "../_components/ComprobanteContent";
import { useSearchParams } from "next/navigation";

export default function ComprobantePage() {
  const searchParams = useSearchParams();
  const data = JSON.parse(searchParams.get("datos") ?? "{}");

  return (
    <PageLayout route={BIBLIOTECA_ROUTE}>
      <ComprobanteContent datos={data} />
    </PageLayout>
  );
}
