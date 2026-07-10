export type SearchFilterContext = "dish" | "restaurant" | "reservation";

export type SearchServiceFilter =
  | "digitalMenu"
  | "pickup"
  | "onlineOrdering"
  | "tableReservation"
  | "delivery"
  | "restroom"
  | "takeAway"
  | "dineIn"
  | "toilets"
  | "kidsMenu";

export type SearchEnvironmentFilter =
  | "modern"
  | "decent"
  | "fastFood"
  | "comfortable"
  | "clean"
  | "traditional"
  | "aesthetic";

export type SearchSortOption =
  | "recommended"
  | "rating"
  | "distance"
  | "deliveryTime";

export interface SearchFilterState {
  priceRange: [number, number];
  distanceRangeKm: [number, number];
  canDeliver: boolean;
  canPickup: boolean;
  environments: SearchEnvironmentFilter[];
  services: SearchServiceFilter[];
  cuisines: string[];
  sort: SearchSortOption;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilterState = {
  priceRange: [1, 11999],
  distanceRangeKm: [0, 50],
  canDeliver: false,
  canPickup: false,
  environments: [],
  services: [],
  cuisines: [],
  sort: "recommended",
};

export const DEFAULT_RESERVATION_FILTERS: SearchFilterState = {
  ...DEFAULT_SEARCH_FILTERS,
  services: ["tableReservation"],
};

export const isDefaultSearchFilters = (
  filters: SearchFilterState,
  defaults: SearchFilterState = DEFAULT_SEARCH_FILTERS,
) =>
  filters.canDeliver === defaults.canDeliver &&
  filters.canPickup === defaults.canPickup &&
  filters.sort === defaults.sort &&
  filters.priceRange[0] === defaults.priceRange[0] &&
  filters.priceRange[1] === defaults.priceRange[1] &&
  filters.distanceRangeKm[0] === defaults.distanceRangeKm[0] &&
  filters.distanceRangeKm[1] === defaults.distanceRangeKm[1] &&
  filters.environments.join("|") === defaults.environments.join("|") &&
  filters.services.join("|") === defaults.services.join("|") &&
  filters.cuisines.join("|") === defaults.cuisines.join("|");
