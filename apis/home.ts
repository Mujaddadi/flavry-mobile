import {
  Category,
  CustomisationGroup,
  Dish,
  DishDetail,
  DishSearchParams,
  DishSearchResult,
  PromoBanner,
  Restaurant,
  RestaurantSearchParams,
  RestaurantSearchResult,
} from "types/home";
import { PopularAddon } from "types/cart";

// TODO: Mock data — swap these functions for real api calls when the backend is ready.

export const fetchCategories = async (): Promise<Category[]> => [
  {
    id: "1",
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200",
  },
  {
    id: "2",
    name: "Sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200",
  },
  {
    id: "3",
    name: "Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
  },
  {
    id: "4",
    name: "Indian",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200",
  },
  {
    id: "5",
    name: "Chinese",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200",
  },
];

export const fetchPromoBanners = async (): Promise<PromoBanner[]> => [
  {
    id: "1",
    title: "Restaurant Food Combo Offers",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600",
  },
  {
    id: "2",
    title: "Weekend Special Deals",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
  },
  {
    id: "3",
    title: "Free Delivery Today",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
  },
];

export const fetchFavouriteDishes = async (): Promise<Dish[]> => [
  {
    id: "1",
    name: "Zinger Burger",
    restaurantId: "r1",
    restaurantName: "Burger King Espoo",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/Burger_King_2020.svg.webp"),
    price: 420,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    discount: "Rs 50 off",
    deliveryTime: "20-25 min",
  },
  {
    id: "2",
    name: "Margherita Pizza",
    restaurantId: "r2",
    restaurantName: "Pizza Palace",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/pizza palace.jpg"),
    price: 350,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    deliveryTime: "25-30 min",
  },
  {
    id: "3",
    name: "Salmon Sushi",
    restaurantId: "r3",
    restaurantName: "Sushi Hub",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/sushi hub.jpeg"),
    price: 580,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    discount: "Rs 30 off",
    deliveryTime: "30-40 min",
  },
];

export const fetchFavouriteRestaurants = async (): Promise<Restaurant[]> => [
  {
    id: "1",
    name: "McDonland Espoo",
    tagline: "I'm lovin' it",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500",
    deliveryDiscount: "2.5k off delivery",
    deliveryTime: "20-25 min",
  },
  {
    id: "2",
    name: "Burger King",
    tagline: "Have it your way",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500",
    deliveryTime: "15-20 min",
  },
];

export const fetchPopularRestaurants = async (): Promise<Restaurant[]> => [
  {
    id: "1",
    name: "McDonland Espoo",
    tagline: "I'm lovin' it",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500",
    deliveryDiscount: "2.5k off delivery",
    deliveryTime: "20-25 min",
  },
  {
    id: "2",
    name: "Sushi Hub",
    tagline: "Fresh from Japan",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500",
    deliveryTime: "30-40 min",
  },
];

const MOCK_SEARCH_DISHES: Dish[] = [
  {
    id: "s1",
    name: "Zinger Burger",
    restaurantId: "r1",
    restaurantName: "Burger King Espoo",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/Burger_King_2020.svg.webp"),
    price: 420,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    discount: "Rs 50 off",
    deliveryTime: "20-25 min",
  },
  {
    id: "s2",
    name: "Beef Burger",
    restaurantId: "r3",
    restaurantName: "Road House Espoo",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/road house logo.jpeg"),
    price: 500,
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400",
    deliveryTime: "20-25 min",
  },
  {
    id: "s3",
    name: "Zinger Burger",
    restaurantId: "r4",
    restaurantName: "Bites Burger Espoo",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/bites burger.jpeg"),
    price: 620,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    deliveryTime: "20-25 min",
  },
  {
    id: "s4",
    name: "Burger Meal",
    restaurantId: "r5",
    restaurantName: "Burger Shop Espoo",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/Burger shop espoo logo.webp"),
    price: 1020,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    discount: "Deal",
    deliveryTime: "20-25 min",
  },
  {
    id: "s5",
    name: "Chicken Burger",
    restaurantId: "r6",
    restaurantName: "Crispy House Espoo",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/Crispy house logo.jpeg"),
    price: 380,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
    deliveryTime: "15-20 min",
  },
  {
    id: "s6",
    name: "Double Smash Burger",
    restaurantId: "r7",
    restaurantName: "Smash Bros Espoo",
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    restaurantLogo: require("../assets/images/smash-bros-logo.png"),
    price: 750,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400",
    discount: "Rs 80 off",
    deliveryTime: "25-30 min",
  },
];

const PAGE_SIZE = 4;

const MOCK_SEARCH_RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "McDonland Espoo",
    tagline: "I'm lovin' it",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    deliveryTime: "20-25 min",
    isClosed: true,
  },
  {
    id: "r2",
    name: "Taste of Thailand Helsinki",
    tagline: "Passionate about food",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
    deliveryTime: "30-35 min",
  },
  {
    id: "r3",
    name: "Wolshed Espoo",
    tagline: "Australian cuisine",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    deliveryTime: "20-25 min",
  },
  {
    id: "r4",
    name: "Taco Bell Espoo",
    tagline: "I'm lovin' it",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
    deliveryTime: "20-25 min",
  },
  {
    id: "r5",
    name: "Burger King Espoo",
    tagline: "Have it your way",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600",
    deliveryDiscount: "Free delivery",
    deliveryTime: "15-20 min",
  },
  {
    id: "r6",
    name: "Sushi Hub Helsinki",
    tagline: "Fresh from Japan",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
    deliveryTime: "35-45 min",
  },
];

const MOCK_DISH_DETAIL_CUSTOMISATIONS: CustomisationGroup[] = [
  {
    id: "drinks",
    title: "Select drink",
    maxSelections: 1,
    options: [
      { id: "fanta", label: "Fanta 0.5 L", isDefault: true },
      { id: "pepsi-zero", label: "Pepsi Zero 0.5 L" },
      { id: "dew", label: "Dew 0.5 L" },
      { id: "coca-cola", label: "Coca-cola 1L" },
      { id: "coffee", label: "Coffee" },
      { id: "pina-colada", label: "Pina Colada", extraPrice: 50 },
    ],
  },
  {
    id: "fries",
    title: "Select fries",
    maxSelections: 1,
    options: [
      { id: "large-fries", label: "Large fries" },
      { id: "medium-fries", label: "Medium fries", isDefault: true },
    ],
  },
];

const MOCK_DISH_DETAIL: DishDetail = {
  id: "s2",
  name: "Beef Burger Meal",
  restaurantId: "r3",
  restaurantName: "Road House Espoo",
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  restaurantLogo: require("../assets/images/road house logo.jpeg"),
  price: 250,
  image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800",
  openUntil: "20:30",
  openTomorrow: "9 AM",
  deliveryMin: 25,
  deliveryMax: 35,
  distanceKm: 5,
  minimumOrder: 600,
  ingredients: "Beef, tomatoes, onions, cheese",
  customisationGroups: MOCK_DISH_DETAIL_CUSTOMISATIONS,
  isFavourited: false,
};

// TODO: Replace with real API call when backend is ready.
export const fetchDishDetail = async (dishId: string): Promise<DishDetail> => {
  // Return the matching mock or fall back to the default mock.
  if (dishId === MOCK_DISH_DETAIL.id || !dishId) return MOCK_DISH_DETAIL;
  return { ...MOCK_DISH_DETAIL, id: dishId };
};

const MOCK_POPULAR_ADDONS: PopularAddon[] = [
  {
    id: "a1",
    name: "Chicken nuggts",
    image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=200",
    price: 350,
  },
  {
    id: "a2",
    name: "French Fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200",
    price: 250,
  },
  {
    id: "a3",
    name: "Ice cream",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200",
    price: 150,
  },
];

// TODO: Replace with real API call when backend is ready.
export const fetchPopularAddons = async (
  _restaurantId: string,
): Promise<PopularAddon[]> => MOCK_POPULAR_ADDONS;

// TODO: Replace with real API call when backend is ready.
export const fetchRestaurantSearch = async ({
  page = 1,
}: RestaurantSearchParams): Promise<RestaurantSearchResult> => {
  const start = (page - 1) * PAGE_SIZE;
  const restaurants = MOCK_SEARCH_RESTAURANTS.slice(start, start + PAGE_SIZE);
  return {
    restaurants,
    total: MOCK_SEARCH_RESTAURANTS.length,
    page,
    hasMore: start + PAGE_SIZE < MOCK_SEARCH_RESTAURANTS.length,
  };
};

// TODO: Replace with real API call when backend is ready.
export const fetchDishSearch = async ({
  page = 1,
}: DishSearchParams): Promise<DishSearchResult> => {
  const start = (page - 1) * PAGE_SIZE;
  const dishes = MOCK_SEARCH_DISHES.slice(start, start + PAGE_SIZE);
  return {
    dishes,
    total: MOCK_SEARCH_DISHES.length,
    page,
    hasMore: start + PAGE_SIZE < MOCK_SEARCH_DISHES.length,
  };
};
