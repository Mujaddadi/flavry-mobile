import { useQuery } from "@tanstack/react-query";

import { fetchRestaurantDetail } from "apis/home";

export const useRestaurantDetail = (restaurantId: string) =>
  useQuery({
    queryKey: ["restaurantDetail", restaurantId],
    queryFn: () => fetchRestaurantDetail(restaurantId),
    staleTime: 5 * 60 * 1000,
    enabled: !!restaurantId,
  });
