import { useQuery } from "@tanstack/react-query";

import { fetchDishDetail } from "apis/home";

export const useDishDetail = (dishId: string) =>
  useQuery({
    queryKey: ["dishDetail", dishId],
    queryFn: () => fetchDishDetail(dishId),
    staleTime: 5 * 60 * 1000,
    enabled: !!dishId,
  });
