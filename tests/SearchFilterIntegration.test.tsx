import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import DishSearch from "screens/DishSearch";
import RestaurantSearch from "screens/RestaurantSearch";

jest.mock("@shopify/flash-list", () => ({
  FlashList: require("react-native").FlatList,
}));

jest.mock("screens/Home/components/SkeletonCard", () => () =>
  require("react").createElement(require("react-native").View, {
    testID: "skeleton-card",
  }),
);

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ query: "", category: "" }),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("store/homeStore", () => ({
  useHomeStore: () => ({ cartCount: 0 }),
}));

jest.mock("hooks/useDishSearch", () => ({
  useDishSearch: () => ({
    data: { pages: [{ dishes: [], total: 0 }] },
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
  }),
}));

jest.mock("hooks/useRestaurantSearch", () => ({
  useRestaurantSearch: () => ({
    data: { pages: [{ restaurants: [], total: 0 }] },
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
  }),
}));

describe("shared search filters integration", () => {
  it("opens the shared filter sheet from Dish Search", async () => {
    await render(<DishSearch />);

    await fireEvent.press(screen.getByLabelText("Sort and filter"));

    await waitFor(() => expect(screen.getByText("Filters")).toBeTruthy());
    expect(screen.getByText("Services")).toBeTruthy();
  });

  it("opens the shared filter sheet from Restaurant Search", async () => {
    await render(<RestaurantSearch />);

    await fireEvent.press(screen.getByLabelText("Sort and filter"));

    await waitFor(() => expect(screen.getByText("Filters")).toBeTruthy());
    expect(screen.getByText("Environments")).toBeTruthy();
  });
});
