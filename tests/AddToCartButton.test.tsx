import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import AddToCartButton from "common/AddToCartButton";

describe("AddToCartButton", () => {
  it("renders an accessible add to cart button and calls onPress", async () => {
    const onPress = jest.fn();

    const { getByLabelText, getByText } = await render(
      <AddToCartButton
        label="Add to cart"
        accessibilityLabel="Add Burger to cart"
        onPress={onPress}
      />,
    );

    await fireEvent.press(getByLabelText("Add Burger to cart"));

    expect(getByText("Add to cart")).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
