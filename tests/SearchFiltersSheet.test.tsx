import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import SearchFiltersSheet from "common/SearchFilters";
import { DEFAULT_SEARCH_FILTERS } from "types/searchFilters";

describe("SearchFiltersSheet", () => {
  it("renders shared filter sections and applies selected options", async () => {
    const onApply = jest.fn();
    const onReset = jest.fn();
    const onClose = jest.fn();

    const { getByLabelText, getByText } = await render(
      <SearchFiltersSheet
        visible
        context="restaurant"
        value={DEFAULT_SEARCH_FILTERS}
        onApply={onApply}
        onReset={onReset}
        onClose={onClose}
      />,
    );

    expect(getByText("Filters")).toBeTruthy();
    expect(getByText("Environments")).toBeTruthy();
    expect(getByText("Services")).toBeTruthy();
    expect(getByText("Cuisines")).toBeTruthy();

    await fireEvent.press(getByLabelText("Select Modern"));
    await fireEvent.press(getByLabelText("Select Table Reservation"));
    await fireEvent.press(getByLabelText("Apply filters"));

    await waitFor(() =>
      expect(onApply).toHaveBeenCalledWith(
        expect.objectContaining({
          environments: ["modern"],
          services: ["tableReservation"],
        }),
      ),
    );
  });

  it("resets local selections", async () => {
    const onApply = jest.fn();
    const onReset = jest.fn();
    const onClose = jest.fn();

    const { getByLabelText } = await render(
      <SearchFiltersSheet
        visible
        context="restaurant"
        value={{ ...DEFAULT_SEARCH_FILTERS, environments: ["modern"] }}
        onApply={onApply}
        onReset={onReset}
        onClose={onClose}
      />,
    );

    await fireEvent.press(getByLabelText("Reset filters"));

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("shows distance range in dish filters", async () => {
    const { getByText } = await render(
      <SearchFiltersSheet
        visible
        context="dish"
        value={DEFAULT_SEARCH_FILTERS}
        onApply={jest.fn()}
        onReset={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(getByText("Distance Range")).toBeTruthy();
  });
});
