import { useQuery } from "@tanstack/react-query";

import { fetchPopularRestaurants } from "apis/home";

export const usePopularRestaurants = () =>
  useQuery({
    queryKey: ["popularRestaurants"],
    queryFn: fetchPopularRestaurants,
    staleTime: 5 * 60 * 1000,
  });
