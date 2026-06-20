import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { Restaurant } from "types/home";
import { wp } from "utils/dimensions";

interface RestaurantCardProps {
  item: Restaurant;
  onPress: (restaurant: Restaurant) => void;
}

const CARD_WIDTH = wp(75);

const RestaurantCard = ({ item, onPress }: RestaurantCardProps) => (
  <Pressable
    style={({ pressed }) => [
      styles.shadowContainer,
      pressed && { opacity: 0.85 },
    ]}
    onPress={() => onPress(item)}
    accessibilityRole="button"
    accessibilityLabel={`${item.name}, ${item.tagline}, delivery ${item.deliveryTime}`}
  >
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          accessibilityLabel={item.name}
        />
        {item.deliveryDiscount && (
          <View style={styles.badge}>
            <MaterialIcons name="local-offer" size={10} color={Colors.white} />
            <Text style={styles.badgeText}>{item.deliveryDiscount}</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.infoRow}>
          <View style={styles.textBlock}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.tagline} numberOfLines={1}>
              {item.tagline}
            </Text>
          </View>
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

const styles = StyleSheet.create({
  shadowContainer: {
    width: CARD_WIDTH,
    marginRight: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: "#000",
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
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  badge: {
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
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs - 1,
    fontWeight: "700",
  },
  body: {
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textBlock: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black2,
  },
  tagline: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
    marginTop: 2,
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
