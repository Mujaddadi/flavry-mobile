export enum DeliveryMode {
  DELIVERY = "delivery",
  PICKUP = "pickup",
}

//TODO: These all will need update based on the API. Maybe I can use graphQL here
export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  image: string;
  linkTarget?: string;
}

export interface Dish {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string | number;
  price: number;
  image: string;
  discount?: string;
  deliveryTime: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  image: string;
  deliveryDiscount?: string;
  deliveryTime: string;
  isClosed?: boolean;
}

export interface RestaurantSearchParams {
  query?: string;
  category?: string;
  filters?: string[];
  page?: number;
}

export interface RestaurantSearchResult {
  restaurants: Restaurant[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface DishSearchParams {
  query?: string;
  category?: string;
  filters?: string[];
  page?: number;
}

export interface DishSearchResult {
  dishes: Dish[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface CustomisationOption {
  id: string;
  label: string;
  extraPrice?: number;
  isDefault?: boolean;
}

export interface CustomisationGroup {
  id: string;
  title: string;
  maxSelections: number;
  options: CustomisationOption[];
}

export interface DishDetail {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string | number;
  price: number;
  image: string;
  openUntil?: string;
  openTomorrow?: string;
  deliveryMin: number;
  deliveryMax: number;
  distanceKm: number;
  minimumOrder: number;
  ingredients: string;
  customisationGroups: CustomisationGroup[];
  isFavourited?: boolean;
}

export interface Promotion {
  id: string;
  label: string;
}

export interface MenuDish {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isFavourite: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  dishes: MenuDish[];
}

export interface OpeningHoursEntry {
  day: string;
  hours: string;
}

export interface RestaurantDetail {
  id: string;
  name: string;
  address: string;
  city?: string;
  image: string;
  status: "open" | "closed";
  deliveryMinMinutes: number;
  deliveryMaxMinutes: number;
  deliveryFee: number;
  minimumOrder: number;
  distanceKm: number;
  openingNote: string;
  openingHours?: OpeningHoursEntry[];
  paymentMethods?: string;
  contactPhone?: string;
  contactEmail?: string;
  promotions: Promotion[];
  menu: MenuCategory[];
  isFavourite: boolean;
}
