import { useQuery } from "@tanstack/react-query";

import { fetchPromoBanners } from "apis/home";

export const usePromoBanners = () =>
  useQuery({
    queryKey: ["promoBanners"],
    queryFn: fetchPromoBanners,
    staleTime: 5 * 60 * 1000,
  });
