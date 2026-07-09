import { useQuery } from "@tanstack/react-query";

import { fetchPopularAddons } from "apis/home";

export const usePopularAddons = (restaurantId: string) =>
  useQuery({
    queryKey: ["popularAddons", restaurantId],
    queryFn: () => fetchPopularAddons(restaurantId),
    staleTime: 5 * 60 * 1000,
    enabled: !!restaurantId,
  });
