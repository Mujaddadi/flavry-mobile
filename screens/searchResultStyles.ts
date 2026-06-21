import { StyleSheet } from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";

export const searchResultCardStyle = { width: "100%" as const, marginRight: 0 };

export const searchResultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resultsSummary: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  list: {
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  skeletonContainer: {
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.black2,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: FontSizes.sm,
    color: Colors.gray3,
  },
});
