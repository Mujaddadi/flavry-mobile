import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchDishSearch } from "apis/home";
import { DishSearchParams } from "types/home";

export const useDishSearch = (params: Omit<DishSearchParams, "page">) =>
  useInfiniteQuery({
    queryKey: ["dishSearch", params],
    queryFn: ({ pageParam }) => fetchDishSearch({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
