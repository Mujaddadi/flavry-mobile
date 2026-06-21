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
  restaurantName: string;
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
