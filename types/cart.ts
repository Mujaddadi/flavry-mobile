export interface CartItem {
  id: string;
  dishId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  customisations?: Record<string, string[]>;
}

export interface PopularAddon {
  id: string;
  name: string;
  image: string;
  price: number;
}
