export interface TableReservationSearchParams {
  query?: string;
  date?: string; // ISO date string
  time?: string; // "HH:MM" 24h
  partySize?: number;
  priceRange?: [number, number];
  page?: number;
}

export interface ReservationRestaurant {
  id: string;
  name: string;
  tagline: string;
  image: string;
  price: number;
  discount?: string;
  rating: number;
  reviewCount: number;
  category: string;
  availableTimes: string[]; // "HH:MM" 24h, e.g. ["18:30", "19:00"]
  isFavourited?: boolean;
}

export type TablePreference = "any" | "indoor" | "outdoor";

export interface ReservationFormData {
  date: string;
  time: string;
  partySize: number;
  tablePreference: TablePreference;
  specialRequests?: string;
  name: string;
  phone: string;
  email: string;
}

export interface TableReservationSearchResult {
  restaurants: ReservationRestaurant[];
  total: number;
  page: number;
  hasMore: boolean;
}
