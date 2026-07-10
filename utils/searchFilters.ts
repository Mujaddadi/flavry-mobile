import { SearchFilterState } from "types/searchFilters";

interface SearchFilterableItem {
  price?: number;
  distanceKm?: number;
  canDeliver?: boolean;
  canPickup?: boolean;
  environments?: string[];
  services?: string[];
  cuisines?: string[];
  rating?: number;
  deliveryTime?: string;
}

export const matchesSearchFilters = (
  item: SearchFilterableItem,
  filters?: SearchFilterState,
) => {
  if (!filters) return true;
  if (filters.canDeliver && !item.canDeliver) return false;
  if (filters.canPickup && !item.canPickup) return false;
  if (
    item.price !== undefined &&
    (item.price < filters.priceRange[0] || item.price > filters.priceRange[1])
  ) {
    return false;
  }
  if (
    item.distanceKm !== undefined &&
    (item.distanceKm < filters.distanceRangeKm[0] ||
      item.distanceKm > filters.distanceRangeKm[1])
  ) {
    return false;
  }
  if (
    filters.environments.length > 0 &&
    !filters.environments.some((value) => item.environments?.includes(value))
  ) {
    return false;
  }
  if (
    filters.services.length > 0 &&
    !filters.services.some((value) => item.services?.includes(value))
  ) {
    return false;
  }
  if (
    filters.cuisines.length > 0 &&
    !filters.cuisines.some((value) => item.cuisines?.includes(value))
  ) {
    return false;
  }
  return true;
};

const getDeliveryMinutes = (deliveryTime?: string) => {
  const match = deliveryTime?.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

export const sortSearchResults = <T extends SearchFilterableItem>(
  items: T[],
  filters?: SearchFilterState,
) => {
  if (!filters || filters.sort === "recommended") return items;
  return [...items].sort((a, b) => {
    if (filters.sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    if (filters.sort === "distance") {
      return (a.distanceKm ?? Number.MAX_SAFE_INTEGER) -
        (b.distanceKm ?? Number.MAX_SAFE_INTEGER);
    }
    return getDeliveryMinutes(a.deliveryTime) - getDeliveryMinutes(b.deliveryTime);
  });
};
