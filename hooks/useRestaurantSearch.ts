import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchRestaurantSearch } from "apis/home";
import { RestaurantSearchParams } from "types/home";

export const useRestaurantSearch = (
  params: Omit<RestaurantSearchParams, "page">,
) =>
  useInfiniteQuery({
    queryKey: ["restaurantSearch", params],
    queryFn: ({ pageParam }) =>
      fetchRestaurantSearch({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
