import { StyleSheet } from "react-native-unistyles";

import { Colors, FontSizes, Spacing } from "./theme";

const lightTheme = {
  colors: {
    ...Colors,
    black1: "#000000",
    black2: "#1D1D1D",
    black3: "#282828",
    white: "#FFFFFF",
    gray1: "#333333",
    gray2: "#4F4F4F",
    gray3: "#828282",
    gray4: "#BDBDBD",
    gray5: "#E0E0E0",
  },
  spacing: Spacing,
  fontSizes: FontSizes,
};

type AppTheme = typeof lightTheme;

declare module "react-native-unistyles" {
  export interface UnistylesThemes {
    light: AppTheme;
  }
}

StyleSheet.configure({
  themes: { light: lightTheme },
  settings: { initialTheme: "light" },
});
