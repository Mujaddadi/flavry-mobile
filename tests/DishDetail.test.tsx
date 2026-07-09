import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import DishDetail from "screens/DishDetail";
import { DishDetail as DishDetailType } from "types/home";

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ dishId: "s2" }),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockAddToCart = jest.fn();
jest.mock("store/homeStore", () => ({
  useHomeStore: () => ({ addToCart: mockAddToCart }),
}));

const MOCK_DISH: DishDetailType = {
  id: "s2",
  name: "Beef Burger Meal",
  restaurantId: "r3",
  restaurantName: "Road House Espoo",
  price: 250,
  image: "https://example.com/burger.jpg",
  openUntil: "20:30",
  openTomorrow: "9 AM",
  deliveryMin: 25,
  deliveryMax: 35,
  distanceKm: 5,
  minimumOrder: 600,
  ingredients: "Beef, tomatoes, onions, cheese",
  customisationGroups: [
    {
      id: "drinks",
      title: "Select drink",
      maxSelections: 1,
      options: [
        { id: "fanta", label: "Fanta 0.5 L", isDefault: true },
        { id: "pepsi", label: "Pepsi Zero 0.5 L" },
        { id: "pina-colada", label: "Pina Colada", extraPrice: 50 },
      ],
    },
    {
      id: "fries",
      title: "Select fries",
      maxSelections: 1,
      options: [
        { id: "large", label: "Large fries" },
        { id: "medium", label: "Medium fries", isDefault: true },
      ],
    },
  ],
  isFavourited: false,
};

jest.mock("hooks/useDishDetail", () => ({
  useDishDetail: () => ({ data: MOCK_DISH, isLoading: false }),
}));

// ── Helpers ─────────────────────────────────────────────────────────────────

const renderScreen = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <DishDetail />
    </QueryClientProvider>,
  );
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe("DishDetail", () => {
  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  it("renders dish name, restaurant, and price", async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("Beef Burger Meal")).toBeTruthy();
      expect(screen.getByText("Road House Espoo")).toBeTruthy();
      expect(screen.getByText("Rs: 250")).toBeTruthy();
    });
  });

  it("renders delivery info and ingredients", async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("Delivery 25–35 minutes")).toBeTruthy();
      expect(screen.getByText("5 km away")).toBeTruthy();
      expect(screen.getByText("Rs 600 minimum order")).toBeTruthy();
      expect(screen.getByText("Beef, tomatoes, onions, cheese")).toBeTruthy();
    });
  });

  it("renders customisation group headings and options", async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("Select drink")).toBeTruthy();
      expect(screen.getByText("Fanta 0.5 L")).toBeTruthy();
      expect(screen.getByText("Select fries")).toBeTruthy();
      expect(screen.getByText("Medium fries")).toBeTruthy();
    });
  });

  it("shows extra price surcharge for options that have one", async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("+ Rs 50")).toBeTruthy();
    });
  });

  it("shows restaurant status and show more link", async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("Open tomorrow at 9 AM")).toBeTruthy();
      expect(screen.getByText("Show more detail")).toBeTruthy();
    });
  });

  it("increments quantity when + is pressed", async () => {
    renderScreen();
    await waitFor(() => expect(screen.getByText("1")).toBeTruthy());
    fireEvent.press(screen.getByLabelText("Increase quantity"));
    await waitFor(() => expect(screen.getByText("2")).toBeTruthy());
  });

  it("does not decrement below 1", async () => {
    renderScreen();
    await waitFor(() => expect(screen.getByText("1")).toBeTruthy());
    fireEvent.press(screen.getByLabelText("Decrease quantity"));
    await waitFor(() => expect(screen.getByText("1")).toBeTruthy());
  });

  it("calls addToCart with dish, customisations and quantity on Add to cart press", async () => {
    renderScreen();
    await waitFor(() => expect(screen.getByText("1")).toBeTruthy());
    fireEvent.press(screen.getByLabelText("Increase quantity"));
    await waitFor(() => expect(screen.getByText("2")).toBeTruthy());
    fireEvent.press(screen.getByLabelText("Add to cart"));
    await waitFor(() => expect(mockAddToCart).toHaveBeenCalledTimes(1));
    expect(mockAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        dish: MOCK_DISH,
        quantity: 2,
      }),
    );
  });

  it("allows multiple options to be selected in a group", async () => {
    renderScreen();
    await waitFor(() => expect(screen.getByText("Fanta 0.5 L")).toBeTruthy());
    // Fanta is default-checked. Pressing Pepsi should also become checked.
    fireEvent.press(screen.getByLabelText("Pepsi Zero 0.5 L"));
    await waitFor(() =>
      expect(
        screen.getByLabelText("Pepsi Zero 0.5 L").props.accessibilityState
          ?.checked,
      ).toBe(true),
    );
    // Fanta should remain checked
    expect(
      screen.getByLabelText("Fanta 0.5 L").props.accessibilityState?.checked,
    ).toBe(true);
  });

  it("toggles favourite icon on heart press", async () => {
    renderScreen();
    await waitFor(() =>
      expect(screen.getByLabelText("Add to favourites")).toBeTruthy(),
    );
    fireEvent.press(screen.getByLabelText("Add to favourites"));
    await waitFor(() =>
      expect(screen.getByLabelText("Remove from favourites")).toBeTruthy(),
    );
  });
});
