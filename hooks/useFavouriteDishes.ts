import { useQuery } from "@tanstack/react-query";

import { fetchFavouriteDishes } from "apis/home";

export const useFavouriteDishes = () =>
  useQuery({
    queryKey: ["favouriteDishes"],
    queryFn: fetchFavouriteDishes,
    staleTime: 5 * 60 * 1000,
  });
