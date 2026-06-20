import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { useHomeStore } from "store/homeStore";
import { Dish } from "types/home";
import { wp } from "utils/dimensions";

interface DishCardProps {
  item: Dish;
  onPress: (dish: Dish) => void;
}

const CARD_WIDTH = wp(72);

const DishCard = ({ item, onPress }: DishCardProps) => {
  const { incrementCart } = useHomeStore();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.shadowContainer,
        pressed && { opacity: 0.85 },
      ]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, delivery ${item.deliveryTime}`}
    >
      <View style={styles.card}>
        {item.discount && (
          <View style={styles.badge}>
            <MaterialIcons name="local-offer" size={10} color={Colors.white} />
            <Text style={styles.badgeText}>{item.discount}</Text>
          </View>
        )}
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          accessibilityLabel={item.name}
        />
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
              onPress={incrementCart}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name} to cart`}
            >
              <Text style={styles.addButtonText}>Add to cart</Text>
            </Pressable>
            <View style={styles.deliveryRow}>
              <MaterialIcons
                name="delivery-dining"
                size={16}
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
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
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
