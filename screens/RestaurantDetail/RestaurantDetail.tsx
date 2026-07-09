import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import AppHeader from "common/AppHeader";
import { useRestaurantDetail } from "hooks/useRestaurantDetail";
import { hp, wp } from "utils/dimensions";

const HERO_HEIGHT = hp(28);
const ICON_MED = wp(4.5);
const ICON_SMALL = wp(3);
const THUMB_SIZE = wp(22);
const ICON_HEART = wp(4);
const ICON_PLUS = wp(5);
const PLUS_BTN = wp(6);

const RestaurantDetail = () => {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: restaurant, isLoading } = useRestaurantDetail(
    restaurantId ?? "",
  );

  const [isFavourited, setIsFavourited] = useState(false);
  const [dishFavourites, setDishFavourites] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!restaurant) return;
    setIsFavourited(restaurant.isFavourite);
    const initial: Record<string, boolean> = {};
    restaurant.menu.forEach((cat) =>
      cat.dishes.forEach((dish) => {
        initial[dish.id] = dish.isFavourite;
      }),
    );
    setDishFavourites(initial);
  }, [restaurant]);

  const toggleFavourite = useCallback(() => {
    // TODO: Replace with API call + optimistic update when backend is ready
    setIsFavourited((prev) => !prev);
  }, []);

  const toggleDishFavourite = useCallback((dishId: string) => {
    // TODO: Replace with API call + optimistic update when backend is ready
    setDishFavourites((prev) => ({ ...prev, [dishId]: !prev[dishId] }));
  }, []);

  const handleShare = useCallback(async () => {
    if (!restaurant) return;
    await Share.share({ message: `Check out ${restaurant.name} on Flavry!` });
  }, [restaurant]);

  if (isLoading || !restaurant) {
    return (
      <View
        style={[styles.container, { paddingTop: insets.top }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={[styles.heroSkeleton, { height: HERO_HEIGHT }]} />
        <View style={styles.skeletonBody}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, styles.skeletonShort]} />
          <View style={[styles.skeletonLine, styles.skeletonMed]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section 1: Header Bar */}
      <AppHeader title={restaurant.name} standalone />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 2: Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.heroImage}
            accessibilityLabel={restaurant.name}
          />
          <Pressable
            style={styles.heroHeartButton}
            onPress={toggleFavourite}
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
        </View>

        {/* Section 3: Restaurant Info */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.address}>{restaurant.address}</Text>
              <View
                style={[
                  styles.statusBadge,
                  restaurant.status === "open" && styles.statusBadgeOpen,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    restaurant.status === "open" && styles.statusTextOpen,
                  ]}
                >
                  {restaurant.status === "open" ? "Open" : "Closed"}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share this restaurant"
              style={styles.shareButton}
            >
              <MaterialIcons
                name="share"
                size={ICON_MED}
                color={Colors.gray3}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section 4: Delivery Info */}
        <View style={styles.dashedContainer}>
          <View style={styles.deliveryRow}>
            <MaterialIcons
              name="delivery-dining"
              size={ICON_MED}
              color={Colors.primary}
            />
            <Text style={styles.deliveryText}>
              Delivery {restaurant.deliveryMinMinutes}–
              {restaurant.deliveryMaxMinutes} minutes
            </Text>
          </View>
          <View style={styles.deliveryMetaRow}>
            <Text style={styles.deliveryFeeText}>
              Delivery charges Rs. {restaurant.deliveryFee}
            </Text>
            <Text style={styles.distanceText}>
              {restaurant.distanceKm} km away
            </Text>
          </View>
          <Text style={styles.minOrderText}>
            Rs {restaurant.minimumOrder} minimum order
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Section 5: Promotions Strip */}
        {restaurant.promotions.length > 0 && (
          <>
            <View style={styles.dashedContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.promotionsContent}
              >
                {restaurant.promotions.map((promo) => (
                  <View key={promo.id} style={styles.promoBadge}>
                    <MaterialIcons
                      name="local-offer"
                      size={ICON_SMALL}
                      color={Colors.primary}
                    />
                    <Text style={styles.promoText}>{promo.label}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Section 6: Menu */}
        {restaurant.menu.map((category) => (
          <View key={category.id}>
            <View style={styles.section}>
              <Text style={styles.categoryHeading}>{category.name}</Text>
            </View>
            {category.dishes.map((dish) => (
              <View key={dish.id}>
                <View style={[styles.section, styles.dishRow]}>
                  <View style={styles.dishTextContent}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishPrice}>Rs: {dish.price}</Text>
                    <Text style={styles.dishDescription} numberOfLines={2}>
                      {dish.description}
                    </Text>
                  </View>
                  <View style={styles.dishImageWrap}>
                    <Image
                      source={{ uri: dish.image }}
                      style={styles.dishThumbnail}
                      accessibilityLabel={dish.name}
                    />
                    <Pressable
                      style={styles.dishHeartButton}
                      onPress={() => toggleDishFavourite(dish.id)}
                      accessibilityRole="button"
                      accessibilityLabel={
                        dishFavourites[dish.id]
                          ? `Remove ${dish.name} from favourites`
                          : `Add ${dish.name} to favourites`
                      }
                    >
                      <MaterialIcons
                        name={
                          dishFavourites[dish.id]
                            ? "favorite"
                            : "favorite-border"
                        }
                        size={ICON_HEART}
                        color={
                          dishFavourites[dish.id]
                            ? Colors.primary
                            : Colors.white
                        }
                      />
                    </Pressable>
                    <Pressable
                      style={styles.dishPlusButton}
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/dishDetail",
                          params: { dishId: dish.id },
                        })
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${dish.name} to cart`}
                    >
                      <MaterialIcons
                        name="add"
                        size={ICON_PLUS}
                        color={Colors.white}
                      />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.divider} />
              </View>
            ))}
          </View>
        ))}

        {/* Section 7: Restaurant Detail Footer */}
        <View style={styles.section}>
          <Text style={styles.footerHeading}>Restaurant detail</Text>
          <View style={styles.footerRow}>
            <Text style={styles.openingNote}>{restaurant.openingNote}</Text>
            <Pressable
              onPress={() => {}}
              accessibilityRole="link"
              accessibilityLabel="Show restaurant details"
            >
              <Text style={styles.showMoreLink}>Show more detail</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Section 8: Make Reservation Button (sticky) */}
      <View
        style={[
          styles.reservationBar,
          { paddingBottom: insets.bottom || Spacing.reg },
        ]}
      >
        <Pressable
          style={styles.reservationButton}
          onPress={() => router.push("/(tabs)/reservations")}
          accessibilityRole="button"
          accessibilityLabel="Make a reservation"
        >
          <Text style={styles.reservationButtonText}>Make reservation</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  heroContainer: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: HERO_HEIGHT,
    resizeMode: "cover",
    backgroundColor: Colors.gray5,
  },
  heroHeartButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.reg,
    padding: Spacing.sm,
    borderRadius: 20,
  },
  section: {
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray5,
    marginHorizontal: Spacing.reg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoLeft: {
    flex: 1,
    gap: Spacing.xs,
    marginRight: Spacing.md,
  },
  restaurantName: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.black1,
  },
  address: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: wp(1.6),
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  statusBadgeOpen: {
    borderColor: Colors.primary,
  },
  statusText: {
    fontSize: FontSizes.xs,
    color: Colors.gray2,
    fontWeight: "600",
  },
  statusTextOpen: {
    color: Colors.primary,
  },
  shareButton: {
    padding: Spacing.xs,
  },
  dashedContainer: {
    marginHorizontal: Spacing.reg,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.gray4,
    borderRadius: 4,
    padding: Spacing.md,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  deliveryText: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
  },
  deliveryMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  deliveryFeeText: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
  distanceText: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
  minOrderText: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
  promotionsContent: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  promoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  promoText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
  categoryHeading: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.black1,
  },
  dishRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  dishTextContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  dishName: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.black1,
  },
  dishPrice: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  dishDescription: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
  dishImageWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Spacing.sm,
    overflow: "hidden",
    position: "relative",
  },
  dishThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: Colors.gray5,
  },
  dishHeartButton: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
    borderRadius: 10,
    padding: 2,
  },
  dishPlusButton: {
    position: "absolute",
    bottom: 5,
    right: 2,
    width: PLUS_BTN,
    height: PLUS_BTN,
    borderRadius: PLUS_BTN / 2,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  footerHeading: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.black1,
    marginBottom: Spacing.xs,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  openingNote: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
  showMoreLink: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  reservationBar: {
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
  },
  reservationButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  reservationButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
  // Skeleton
  heroSkeleton: {
    width: "100%",
    backgroundColor: Colors.gray5,
  },
  skeletonBody: {
    padding: Spacing.reg,
    gap: Spacing.md,
  },
  skeletonLine: {
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.gray5,
    width: "80%",
  },
  skeletonShort: {
    width: "50%",
  },
  skeletonMed: {
    width: "65%",
  },
});

export default RestaurantDetail;
