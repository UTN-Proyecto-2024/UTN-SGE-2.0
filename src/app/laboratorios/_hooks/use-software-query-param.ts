import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { inputGetSoftwareFilter } from "@/shared/filters/laboratorio-filter.schema";

type SoftwareFilters = z.infer<typeof inputGetSoftwareFilter>;
type OrderByType = z.infer<typeof inputGetSoftwareFilter>["orderBy"];
type PageSizeType = z.infer<typeof inputGetSoftwareFilter>["pageSize"];

const createQueryString = (filters: SoftwareFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: SoftwareFilters, newSorting: SortingState): SoftwareFilters => {
  const newFilters: SoftwareFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetSoftwareFilter.parse(newFilters);

  return filtersTyped;
};

const changePagination = (filters: SoftwareFilters, newPagination: PaginationState): SoftwareFilters => {
  const newFilters: SoftwareFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetSoftwareFilter.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (filters: SoftwareFilters, searchText: string): SoftwareFilters => {
  const newFilters: SoftwareFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetSoftwareFilter.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: SoftwareFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: SoftwareFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useSoftwareQueryParam = (filters: SoftwareFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;

  const changeQueryParams = useCallback(
    (filters: SoftwareFilters) => {
      router.push(pathname + "?" + createQueryString(filters));
    },
    [pathname, router],
  );

  const onSortingChange = useCallback(
    (sorting: SortingState) => {
      const newFilters = changeSorting(filters, sorting);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  const onPaginationChange = useCallback(
    (pagination: PaginationState) => {
      const newFilters = changePagination(filters, pagination);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  const onSearchTextChange = useCallback(
    (searchText: string) => {
      const newFilters = changeSearchText(filters, searchText);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  return {
    refresh: () => router.refresh(),
    pagination,
    sorting,
    searchText,
    onSortingChange,
    onPaginationChange,
    onSearchTextChange,
  };
};
