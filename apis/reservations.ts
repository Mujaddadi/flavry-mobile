import {
  ReservationFormData,
  ReservationRestaurant,
  TableReservationSearchParams,
  TableReservationSearchResult,
} from "types/reservation";
import { matchesSearchFilters, sortSearchResults } from "utils/searchFilters";

// TODO: Mock data — swap these functions for real API calls when the backend is ready.

const MOCK_RESERVATION_RESTAURANTS: ReservationRestaurant[] = [
  {
    id: "rr1",
    name: "Burger King Espoo",
    tagline: "Have it your way",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    price: 1200,
    discount: "Rs 500 off",
    rating: 4.5,
    reviewCount: 128,
    category: "Burger",
    availableTimes: ["18:30", "19:00", "19:30", "20:00", "20:30"],
    isFavourited: false,
    distanceKm: 2,
    canDeliver: true,
    canPickup: true,
    environments: ["modern", "clean"],
    services: ["tableReservation", "digitalMenu", "delivery", "pickup"],
    cuisines: ["American", "Fast Food"],
  },
  {
    id: "rr2",
    name: "Road House Espoo",
    tagline: "Grill house and steaks",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600",
    price: 1800,
    rating: 4.2,
    reviewCount: 89,
    category: "Steakhouse",
    availableTimes: ["19:30", "20:00", "20:30", "21:00", "21:30"],
    isFavourited: false,
    distanceKm: 5,
    canDeliver: false,
    canPickup: true,
    environments: ["comfortable", "modern"],
    services: ["tableReservation", "pickup", "dineIn", "restroom"],
    cuisines: ["American", "Continental"],
  },
  {
    id: "rr3",
    name: "Taste of Thailand Helsinki",
    tagline: "Passionate about food",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
    price: 620,
    rating: 4.7,
    reviewCount: 203,
    category: "Thai",
    availableTimes: ["18:30", "19:30", "20:00", "20:30", "21:00"],
    isFavourited: false,
    distanceKm: 8,
    canDeliver: true,
    canPickup: false,
    environments: ["traditional", "comfortable"],
    services: ["tableReservation", "delivery", "dineIn"],
    cuisines: ["Thai", "Asian"],
  },
  {
    id: "rr4",
    name: "Wolshed Espoo",
    tagline: "Australian cuisine",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    price: 620,
    rating: 4.3,
    reviewCount: 156,
    category: "Australian",
    availableTimes: ["19:00", "20:00", "20:30", "21:00", "21:30"],
    isFavourited: false,
    distanceKm: 6,
    canDeliver: false,
    canPickup: true,
    environments: ["aesthetic", "modern"],
    services: ["tableReservation", "pickup", "digitalMenu"],
    cuisines: ["Australian", "Continental"],
  },
  {
    id: "rr5",
    name: "Sushi Hub Helsinki",
    tagline: "Fresh from Japan",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
    price: 780,
    discount: "Rs 100 off",
    rating: 4.8,
    reviewCount: 312,
    category: "Sushi",
    availableTimes: ["18:00", "18:30", "19:00", "20:30", "21:30"],
    isFavourited: false,
    distanceKm: 9,
    canDeliver: true,
    canPickup: false,
    environments: ["clean", "aesthetic"],
    services: ["tableReservation", "delivery", "restroom"],
    cuisines: ["Sushi", "Japanese"],
  },
  {
    id: "rr6",
    name: "Pizza Palace",
    tagline: "Authentic Italian",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
    price: 350,
    rating: 4.1,
    reviewCount: 74,
    category: "Pizza",
    availableTimes: ["17:30", "18:00", "19:30", "20:00", "21:00"],
    isFavourited: false,
    distanceKm: 4,
    canDeliver: true,
    canPickup: true,
    environments: ["decent", "comfortable"],
    services: ["tableReservation", "delivery", "pickup", "kidsMenu"],
    cuisines: ["Italian", "Pizza"],
  },
];

const PAGE_SIZE = 4;

// TODO: Replace with real API call when backend is ready.
export const fetchTableReservationSearch = async ({
  page = 1,
  searchFilters,
}: TableReservationSearchParams): Promise<TableReservationSearchResult> => {
  const start = (page - 1) * PAGE_SIZE;
  const filtered = sortSearchResults(
    MOCK_RESERVATION_RESTAURANTS.filter((restaurant) =>
      matchesSearchFilters(restaurant, searchFilters),
    ),
    searchFilters,
  );
  const restaurants = filtered.slice(start, start + PAGE_SIZE);
  return {
    restaurants,
    total: filtered.length,
    page,
    hasMore: start + PAGE_SIZE < filtered.length,
  };
};

// TODO: Replace with real API call when backend is ready.
export const submitTableReservation = async (
  _payload: ReservationFormData & { restaurantId: string },
): Promise<{ success: boolean; reservationId: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true, reservationId: `res_${Date.now()}` };
};
