import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { usePathname } from "expo-router";

import { useHomeStore } from "store/homeStore";
import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { getHeaderName } from "./utilityFunctions";

const CustomHeader = () => {
  const currentRoute = usePathname();
  const { width } = useWindowDimensions();
  const { location, cartCount } = useHomeStore();
  //This is to show the current screen name in the header
  const isHome = currentRoute === "/";

  return (
    <View style={[styles.container, { width: width - 30 }]}>
      {/* Left: location (home) or screen title (other screens) */}
      <Pressable
        style={styles.locationRow}
        accessibilityLabel={
          isHome ? `Current location: ${location}` : undefined
        }
        accessibilityRole={isHome ? "button" : undefined}
      >
        {isHome ? (
          <>
            <MaterialIcons
              name="location-on"
              size={18}
              color={Colors.textLight}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </>
        ) : (
          <Text style={styles.screenTitle}>{getHeaderName(currentRoute)}</Text>
        )}
      </Pressable>

      {/* Right: cart icon with badge */}
      <Pressable
        style={styles.cartButton}
        accessibilityLabel={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
        accessibilityRole="button"
      >
        <MaterialIcons
          name="shopping-cart"
          size={24}
          color={Colors.textLight}
        />
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    flex: 1,
  },
  locationText: {
    color: Colors.textLight,
    fontSize: FontSizes.md,
    fontWeight: "600",
    flexShrink: 1,
  },
  screenTitle: {
    color: Colors.textLight,
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  cartButton: {
    padding: Spacing.xs,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.textLight,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: FontSizes.xs - 2,
    fontWeight: "700",
  },
});

export default CustomHeader;
