import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchTableReservationSearch } from "apis/reservations";
import { TableReservationSearchParams } from "types/reservation";

export const useTableReservationSearch = (
  params: Omit<TableReservationSearchParams, "page">,
) =>
  useInfiniteQuery({
    queryKey: ["tableReservationSearch", params],
    queryFn: ({ pageParam }) =>
      fetchTableReservationSearch({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
