"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { type z } from "zod";
import { useState } from "react";
import { type inputGetSoftwareFilter } from "@/shared/filters/laboratorio-filter.schema";
import { useSoftwareQueryParam } from "@/app/laboratorios/_hooks/use-software-query-param";

type SoftwareFilters = z.infer<typeof inputGetSoftwareFilter>;

type Props = {
  filters: SoftwareFilters;
};

export const SoftwareFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useSoftwareQueryParam(filters);

  const [currentSearchText, setCurrentSearchText] = useState(searchText);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setCurrentSearchText(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onSearchTextChange("");
    }

    if (e.key === "Enter") {
      onSearchTextChange(currentSearchText);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Input
        placeholder={"Buscar por nombre"}
        name="searchText"
        unit={<SearchIcon className="text-sub relative top-0.5 h-4 w-4" />}
        type={"search"}
        value={currentSearchText}
        onChange={handleTextChange}
        onKeyUp={handleKeyUp}
        autoFocus
      />
    </form>
  );
};
