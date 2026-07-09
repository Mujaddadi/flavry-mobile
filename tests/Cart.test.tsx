import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import Cart from "screens/Cart";
import { CartItem, PopularAddon } from "types/cart";

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const MOCK_ADDONS: PopularAddon[] = [
  {
    id: "a1",
    name: "Chicken nuggts",
    image: "https://example.com/a1.jpg",
    price: 350,
  },
  {
    id: "a2",
    name: "French Fries",
    image: "https://example.com/a2.jpg",
    price: 250,
  },
];

jest.mock("hooks/usePopularAddons", () => ({
  usePopularAddons: () => ({ data: MOCK_ADDONS }),
}));

const MOCK_ITEMS: CartItem[] = [
  {
    id: "d1",
    dishId: "d1",
    name: "Double Steakhouse",
    description: "beef steak",
    image: "https://example.com/d1.jpg",
    price: 1840,
    quantity: 1,
    restaurantId: "r1",
    restaurantName: "Burger King Espoo",
    restaurantLogo: "",
  },
  {
    id: "d2",
    dishId: "d2",
    name: "Crispy chicken burger",
    description: "Tasty chicken burger with myonease",
    image: "https://example.com/d2.jpg",
    price: 540,
    quantity: 1,
    restaurantId: "r1",
    restaurantName: "Burger King Espoo",
    restaurantLogo: "",
  },
  {
    id: "d3",
    dishId: "d3",
    name: "Zinger Burger deal",
    description: "Zinger burger, large fries, Pepsi.",
    image: "https://example.com/d3.jpg",
    price: 1840,
    quantity: 1,
    restaurantId: "r2",
    restaurantName: "KFC",
    restaurantLogo: "",
  },
];

const mockUpdateQuantity = jest.fn();
const mockAddItem = jest.fn();
const mockSetSpecialInstructions = jest.fn();
const mockApplyVoucher = jest.fn();
const mockClearVoucher = jest.fn();

// jest.fn() so individual tests can call mockImplementation to override state.
const mockUseCartStore = jest.fn();

jest.mock("store/cartStore", () => ({
  // Delegate to mockUseCartStore so tests can override via mockImplementation.
  useCartStore: (...args: unknown[]) =>
    mockUseCartStore(...(args as [unknown])),
}));

// ── Helpers ─────────────────────────────────────────────────────────────────

const makeCartState = (overrides: Record<string, unknown> = {}) => ({
  items: MOCK_ITEMS,
  specialInstructions: {},
  voucher: "",
  discount: 0,
  updateQuantity: mockUpdateQuantity,
  addItem: mockAddItem,
  setSpecialInstructions: mockSetSpecialInstructions,
  applyVoucher: mockApplyVoucher,
  clearVoucher: mockClearVoucher,
  ...overrides,
});

const renderScreen = (overrides: Record<string, unknown> = {}) => {
  const state = makeCartState(overrides);
  mockUseCartStore.mockImplementation((selector: unknown) =>
    typeof selector === "function" ? selector(state) : state,
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <Cart />
    </QueryClientProvider>,
  );
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe("Cart", () => {
  beforeEach(() => {
    mockUpdateQuantity.mockClear();
    mockAddItem.mockClear();
    mockSetSpecialInstructions.mockClear();
    mockApplyVoucher.mockClear();
    mockClearVoucher.mockClear();
    mockUseCartStore.mockClear();
  });

  it("renders empty state when cart has no items", async () => {
    renderScreen({ items: [] });
    await waitFor(() =>
      expect(screen.getByText("Your cart is empty")).toBeTruthy(),
    );
  });

  it("renders restaurant group names", async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("Burger King Espoo")).toBeTruthy();
      expect(screen.getByText("KFC")).toBeTruthy();
    });
  });

  it("renders cart item names and descriptions", async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText("Double Steakhouse")).toBeTruthy();
      expect(screen.getByText("beef steak")).toBeTruthy();
      expect(screen.getByText("Crispy chicken burger")).toBeTruthy();
      expect(screen.getByText("Zinger Burger deal")).toBeTruthy();
    });
  });

  it("renders group totals correctly", async () => {
    renderScreen();
    // Burger King: 1840 + 540 = 2380; KFC: 1840
    await waitFor(() => {
      expect(screen.getByText("Total Rs.2380")).toBeTruthy();
      expect(screen.getByText("Total Rs.1840")).toBeTruthy();
    });
  });

  it("shows grand total in checkout bar", async () => {
    renderScreen();
    // 2380 + 1840 = 4220, no discount
    await waitFor(() =>
      expect(screen.getByLabelText("Checkout, total RS. 4220")).toBeTruthy(),
    );
  });

  it("calls updateQuantity when + is pressed", async () => {
    renderScreen();
    await waitFor(() =>
      expect(screen.getByText("Double Steakhouse")).toBeTruthy(),
    );
    fireEvent.press(
      screen.getByLabelText("Increase quantity of Double Steakhouse"),
    );
    await waitFor(() =>
      expect(mockUpdateQuantity).toHaveBeenCalledWith("d1", 2),
    );
  });

  it("calls updateQuantity with 0 when − is pressed at quantity 1 (removes item)", async () => {
    renderScreen();
    await waitFor(() =>
      expect(screen.getByText("Double Steakhouse")).toBeTruthy(),
    );
    fireEvent.press(
      screen.getByLabelText("Decrease quantity of Double Steakhouse"),
    );
    await waitFor(() =>
      expect(mockUpdateQuantity).toHaveBeenCalledWith("d1", 0),
    );
  });

  it("renders popular add-ons for each restaurant group", async () => {
    renderScreen();
    await waitFor(() => {
      const nuggts = screen.getAllByText("Chicken nuggts");
      expect(nuggts.length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("French Fries").length).toBeGreaterThanOrEqual(
        1,
      );
    });
  });

  it("calls addItem when an add-on + button is pressed", async () => {
    renderScreen();
    await waitFor(() =>
      expect(
        screen.getAllByLabelText("Add Chicken nuggts to cart").length,
      ).toBeGreaterThan(0),
    );
    fireEvent.press(screen.getAllByLabelText("Add Chicken nuggts to cart")[0]);
    await waitFor(() => expect(mockAddItem).toHaveBeenCalledTimes(1));
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Chicken nuggts", price: 350 }),
    );
  });

  it("shows voucher error when Apply is pressed with empty input", async () => {
    renderScreen();
    await waitFor(() =>
      expect(screen.getByLabelText("Apply voucher")).toBeTruthy(),
    );
    fireEvent.press(screen.getByLabelText("Apply voucher"));
    await waitFor(() =>
      expect(screen.getByText("Enter a voucher code")).toBeTruthy(),
    );
  });

  it("shows Remove button and calls clearVoucher when voucher is already applied", async () => {
    renderScreen({ voucher: "SAVE10", discount: 100 });
    await waitFor(() =>
      expect(screen.getByLabelText("Remove voucher")).toBeTruthy(),
    );
    fireEvent.press(screen.getByLabelText("Remove voucher"));
    await waitFor(() => expect(mockClearVoucher).toHaveBeenCalledTimes(1));
  });

  // Keep this last — a successful form submission leaves pending react-hook-form
  // async effects that can interfere with subsequent renders in React 19 concurrent mode.
  it("calls applyVoucher when a code is entered and Apply is pressed", async () => {
    renderScreen();
    await waitFor(() =>
      expect(screen.getByLabelText("Voucher code")).toBeTruthy(),
    );
    fireEvent.changeText(screen.getByLabelText("Voucher code"), "SAVE10");
    fireEvent.press(screen.getByLabelText("Apply voucher"));
    await waitFor(() =>
      expect(mockApplyVoucher).toHaveBeenCalledWith("SAVE10", 0),
    );
  });
});
