"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { type z } from "zod";
import { useState } from "react";
import type { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { useReservasLaboratorioCerradoQueryParam } from "../../_hooks/use-reserva-laboratorio-cerrado-query-param";

type reservaLaboratorioCerradoFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type Props = {
  filters: reservaLaboratorioCerradoFilters;
};

export const LaboratorioCerradoReservasFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useReservasLaboratorioCerradoQueryParam(filters);

  const [currentSearchText, setCurrentSearchText] = useState(searchText);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setCurrentSearchText(e.target.value);

    if (!e.target.value) onSearchTextChange("");
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onSearchTextChange("");
    }

    if (e.key === "Enter") {
      onSearchTextChange(currentSearchText);
    }
  };

  const onClickIcon = () => {
    onSearchTextChange(currentSearchText);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Input
        placeholder={"Buscar por división, materia, sede o laboratorio"}
        name="searchText"
        unit={<SearchIcon className="text-sub relative top-0.5 h-4 w-4" onClick={onClickIcon} />}
        type={"search"}
        value={currentSearchText}
        onChange={handleTextChange}
        onKeyUp={handleKeyUp}
        autoFocus
      />
    </form>
  );
};
