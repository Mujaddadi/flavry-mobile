import { useQuery } from "@tanstack/react-query";

import { fetchFavouriteRestaurants } from "apis/home";

export const useFavouriteRestaurants = () =>
  useQuery({
    queryKey: ["favouriteRestaurants"],
    queryFn: fetchFavouriteRestaurants,
    staleTime: 5 * 60 * 1000,
  });
