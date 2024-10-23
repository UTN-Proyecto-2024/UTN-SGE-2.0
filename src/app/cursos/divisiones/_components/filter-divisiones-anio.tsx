"use client";

import React, { useMemo, useState } from "react";
import { Autocomplete } from "@/components/ui";
import { type z } from "zod";
import { estaDentroDe } from "@/shared/string-compare";
import type { inputGetDivisiones } from "@/shared/filters/divisiones-filter.schema";
import { useDivisionesQueryParam } from "../_hooks/use-divisiones-query-params";

type DivisionesFilters = z.infer<typeof inputGetDivisiones>;

type Props = {
  filters: DivisionesFilters;
};

export const DivisionesFilterAño = ({ filters }: Props) => {
  const { año, onAñoChange } = useDivisionesQueryParam(filters);
  const [query, setQuery] = useState("");

  const años = useMemo(
    () =>
      ["1", "2", "3", "4", "5", "6"]
        .map((item) => {
          return { id: item, label: item, data: item };
        })
        .filter((item) => !query || estaDentroDe(query, item.label)),
    [query],
  );

  const currentAño = useMemo(() => {
    if (!años) return null;
    return años.find((item) => String(item.id) === año);
  }, [años, año]);

  return (
    <div className="w-full">
      <Autocomplete
        async
        items={años}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
            <span>No se encontró la materia</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        placeholder="Año"
        clearable
        debounceTime={0}
        value={currentAño}
        onChange={(value) => onAñoChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};
