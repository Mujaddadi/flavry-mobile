import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useCallback } from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { useCartStore } from "store/cartStore";
import { useHomeStore } from "store/homeStore";
import { Dish } from "types/home";
import { wp } from "utils/dimensions";

interface DishCardProps {
  item: Dish;
  onPress: (dish: Dish) => void;
  isFavourited?: boolean;
  onFavouritePress?: (dish: Dish) => void;
  style?: StyleProp<ViewStyle>;
}

const CARD_WIDTH = wp(72);
const IMAGE_HEIGHT = wp(30);
const RIBBON_CORNER = wp(19);
const RIBBON_WIDTH = wp(23.5);
const RIBBON_TOP = wp(4.3);
const RIBBON_LEFT = -wp(5.9);
const ICON_SMALL = wp(3);
const ICON_MED = wp(4.5);
const ICON_HEART = wp(5);

const DishCard = ({
  item,
  onPress,
  isFavourited = false,
  onFavouritePress,
  style,
}: DishCardProps) => {
  const { incrementCart } = useHomeStore();

  const handleAddToCart = useCallback(() => {
    useCartStore.getState().addItem({
      id: item.id,
      dishId: item.id,
      name: item.name,
      description: "",
      image: item.image,
      price: item.price,
      quantity: 1,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      restaurantLogo: "",
    });
    incrementCart();
  }, [item, incrementCart]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.shadowContainer,
        style,
        pressed && { opacity: 0.85 },
      ]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, delivery ${item.deliveryTime}`}
    >
      <View style={styles.card}>
        {item.discount &&
          (item.discount === "Deal" ? (
            <View style={styles.ribbonWrap}>
              <View style={styles.ribbon}>
                <Text style={styles.ribbonText}>{item.discount}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.badge}>
              <MaterialIcons
                name="local-offer"
                size={ICON_SMALL}
                color={Colors.white}
              />
              <Text style={styles.badgeText}>{item.discount}</Text>
            </View>
          ))}
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          accessibilityLabel={item.name}
        />
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
              size={ICON_HEART}
              color={isFavourited ? Colors.primary : Colors.white}
            />
          </Pressable>
        )}
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.price}>Rs {item.price}</Text>
          </View>
          <Text style={styles.restaurant} numberOfLines={1}>
            {item.restaurantName}
          </Text>
          <View style={styles.footer}>
            <Pressable
              style={styles.addButton}
              onPress={handleAddToCart}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name} to cart`}
            >
              <Text style={styles.addButtonText}>Add to cart</Text>
            </Pressable>
            <View style={styles.deliveryRow}>
              <MaterialIcons
                name="delivery-dining"
                size={ICON_MED}
                color={Colors.gray3}
              />
              <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    width: CARD_WIDTH,
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
  badge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs - 1,
    fontWeight: "700",
  },
  ribbonWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    width: RIBBON_CORNER,
    height: RIBBON_CORNER,
    overflow: "hidden",
    zIndex: 1,
  },
  ribbon: {
    position: "absolute",
    top: RIBBON_TOP,
    left: RIBBON_LEFT,
    width: RIBBON_WIDTH,
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingVertical: 5,
    transform: [{ rotate: "-45deg" }],
  },
  ribbonText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    zIndex: 1,
    padding: Spacing.xs,
  },
  body: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black2,
    marginRight: Spacing.xs,
  },
  price: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  restaurant: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.xs,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 20,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
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

export default DishCard;
