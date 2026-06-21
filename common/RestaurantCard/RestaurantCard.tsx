import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { Restaurant } from "types/home";
import { wp } from "utils/dimensions";

interface RestaurantCardProps {
  item: Restaurant;
  onPress: (restaurant: Restaurant) => void;
  isFavourited?: boolean;
  onFavouritePress?: (restaurant: Restaurant) => void;
  width?: number;
}

const CARD_WIDTH = wp(75);
const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = Math.round((CARD_WIDTH / SCREEN_WIDTH) * 140);
const ICON_SMALL = wp(3);
const ICON_MED = wp(4.5);

const RestaurantCard = ({
  item,
  onPress,
  isFavourited = false,
  onFavouritePress,
  width = CARD_WIDTH,
}: RestaurantCardProps) => (
  <Pressable
    style={({ pressed }) => [
      styles.shadowContainer,
      { width },
      pressed && { opacity: 0.85 },
    ]}
    onPress={() => onPress(item)}
    accessibilityRole="button"
    accessibilityLabel={`${item.name}, ${item.tagline}, delivery ${item.deliveryTime}`}
  >
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        accessibilityLabel={item.name}
      />
      {item.deliveryDiscount && (
        <View style={styles.discountBadge}>
          <MaterialIcons
            name="local-offer"
            size={ICON_SMALL}
            color={Colors.white}
          />
          <Text style={styles.discountBadgeText}>{item.deliveryDiscount}</Text>
        </View>
      )}
      {onFavouritePress && (
        <Pressable
          style={styles.heartButton}
          onPress={() => onFavouritePress(item)}
          accessibilityRole="button"
          accessibilityLabel={
            isFavourited ? "Remove from favourites" : "Add to favourites"
          }
        >
          <MaterialIcons
            name={isFavourited ? "favorite" : "favorite-border"}
            size={ICON_MED}
            color={isFavourited ? Colors.primary : Colors.white}
          />
        </Pressable>
      )}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          {item.isClosed ? (
            <View style={styles.closedBadge}>
              <Text style={styles.closedText}>Closed</Text>
            </View>
          ) : (
            <Text style={styles.tagline} numberOfLines={1}>
              {item.tagline}
            </Text>
          )}
          <View style={styles.deliveryRow}>
            <MaterialIcons
              name="delivery-dining"
              size={ICON_MED}
              color={Colors.primary}
            />
            <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          </View>
        </View>
        {item.isClosed && (
          <Text style={styles.tagline} numberOfLines={1}>
            {item.tagline}
          </Text>
        )}
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  shadowContainer: {
    marginRight: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 12,
    shadowColor: Colors.black1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 20,
  },
  discountBadgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs - 1,
    fontWeight: "700",
  },
  heartButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    padding: Spacing.xs,
  },
  body: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black2,
  },
  tagline: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  closedBadge: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  closedText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deliveryTime: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
});

export default RestaurantCard;
