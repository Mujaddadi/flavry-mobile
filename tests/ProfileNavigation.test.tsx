import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import Profile from "screens/Profile";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("Profile navigation", () => {
  beforeEach(() => mockPush.mockClear());

  it.each([
    ["FAQ", "/(tabs)/faq"],
    ["Privacy Policy", "/(tabs)/privacyPolicy"],
    ["Terms & Conditions", "/(tabs)/termsConditions"],
    ["Refund Policy", "/(tabs)/refundPolicy"],
    ["Contact Us", "/(tabs)/contactUs"],
  ])("opens %s", async (label, route) => {
    const view = await render(<Profile />);
    await fireEvent.press(view.getByLabelText(label));
    expect(mockPush).toHaveBeenCalledWith(route);
  });
});
