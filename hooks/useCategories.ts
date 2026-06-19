import { useQuery } from "@tanstack/react-query";

import { fetchCategories } from "apis/home";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
