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
import { useDishDetail } from "hooks/useDishDetail";
import { useHomeStore } from "store/homeStore";
import { CustomisationGroup } from "types/home";
import { hp, wp } from "utils/dimensions";

const HERO_HEIGHT = hp(40);
const ICON_SIZE = wp(5.5);
const CHECKBOX_SIZE = wp(5);
const ICON_MED = wp(4.5);

const DishDetail = () => {
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart } = useHomeStore();

  const { data: dish, isLoading } = useDishDetail(dishId ?? "");

  const [isFavourited, setIsFavourited] = useState(false);
  const [customisations, setCustomisations] = useState<
    Record<string, string[]>
  >({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!dish) return;
    setIsFavourited(dish.isFavourited ?? false);
    const defaults: Record<string, string[]> = {};
    dish.customisationGroups.forEach((group) => {
      defaults[group.id] = group.options
        .filter((opt) => opt.isDefault)
        .map((opt) => opt.id);
    });
    setCustomisations(defaults);
  }, [dish]);

  const toggleFavourite = useCallback(() => {
    // TODO: Replace with API call + optimistic update when backend is ready
    setIsFavourited((prev) => !prev);
  }, []);

  const toggleOption = useCallback(
    (group: CustomisationGroup, optionId: string) => {
      setCustomisations((prev) => {
        const current = prev[group.id] ?? [];
        if (group.maxSelections === 1) {
          return { ...prev, [group.id]: [optionId] };
        }
        const isSelected = current.includes(optionId);
        return {
          ...prev,
          [group.id]: isSelected
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      });
    },
    [],
  );

  const handleShare = useCallback(async () => {
    if (!dish) return;
    await Share.share({ message: `Check out ${dish.name} on Flavry!` });
  }, [dish]);

  const handleAddToCart = useCallback(() => {
    if (!dish) return;
    addToCart({ dish, customisations, quantity });
    router.back();
  }, [dish, customisations, quantity, addToCart, router]);

  if (isLoading || !dish) {
    return (
      <View style={styles.container}>
        <View
          style={[styles.heroSkeleton, { height: HERO_HEIGHT + insets.top }]}
        />
        <View style={styles.skeletonBody}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, styles.skeletonShort]} />
          <View style={[styles.skeletonLine, styles.skeletonMed]} />
        </View>
      </View>
    );
  }

  const restaurantStatus = dish.openTomorrow
    ? `Open tomorrow at ${dish.openTomorrow}`
    : dish.openUntil
      ? `Open until ${dish.openUntil}`
      : "";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: dish.image }}
            style={styles.heroImage}
            accessibilityLabel={dish.name}
          />
          <Pressable
            style={[styles.backButton, { top: insets.top + Spacing.sm }]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialIcons
              name="arrow-back"
              size={ICON_SIZE}
              color={Colors.white}
            />
          </Pressable>
          <Pressable
            style={[styles.heroHeartButton, { top: insets.top + Spacing.sm }]}
            onPress={toggleFavourite}
            accessibilityRole="button"
            accessibilityLabel={
              isFavourited ? "Remove from favourites" : "Add to favourites"
            }
          >
            <MaterialIcons
              name={isFavourited ? "favorite" : "favorite-border"}
              size={ICON_SIZE}
              color={isFavourited ? Colors.primary : Colors.white}
            />
          </Pressable>
        </View>

        {/* Section 2: Dish Info Row */}
        <View style={styles.section}>
          <View style={styles.dishInfoRow}>
            <View style={styles.dishInfoLeft}>
              <Text style={styles.dishName}>{dish.name}</Text>
              <Pressable
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel={`View ${dish.restaurantName}`}
              >
                <Text style={styles.restaurantName}>{dish.restaurantName}</Text>
              </Pressable>
              {dish.openUntil && (
                <Text style={styles.openUntil}>
                  Open until {dish.openUntil}
                </Text>
              )}
            </View>
            <View style={styles.dishInfoRight}>
              <Text style={styles.price}>Rs: {dish.price}</Text>
              <Pressable
                onPress={handleShare}
                accessibilityRole="button"
                accessibilityLabel="Share this dish"
                style={styles.shareButton}
              >
                <MaterialIcons
                  name="share"
                  size={ICON_SIZE}
                  color={Colors.gray3}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section 3: Delivery Info */}
        <View style={styles.section}>
          <View style={styles.deliveryRow}>
            <View style={styles.deliveryLeft}>
              <MaterialIcons
                name="delivery-dining"
                size={ICON_MED}
                color={Colors.gray3}
              />
              <Text style={styles.deliveryText}>
                Delivery {dish.deliveryMin}–{dish.deliveryMax} minutes
              </Text>
            </View>
            <Text style={styles.distanceText}>{dish.distanceKm} km away</Text>
          </View>
          <Text style={styles.minimumOrder}>
            Rs {dish.minimumOrder} minimum order
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Section 4: Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Ingredients</Text>
          <Text style={styles.bodyText}>{dish.ingredients}</Text>
        </View>

        <View style={styles.divider} />

        {/* Section 5: Customisation Groups */}
        {dish.customisationGroups.map((group) => (
          <View key={group.id}>
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>{group.title}</Text>
              {group.options.map((option) => {
                const selected = (customisations[group.id] ?? []).includes(
                  option.id,
                );
                return (
                  <Pressable
                    key={option.id}
                    style={styles.optionRow}
                    onPress={() => toggleOption(group, option.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={option.label}
                  >
                    <MaterialIcons
                      name={selected ? "check-box" : "check-box-outline-blank"}
                      size={CHECKBOX_SIZE}
                      color={selected ? Colors.primary : Colors.gray4}
                    />
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    {(option.extraPrice ?? 0) > 0 && (
                      <Text style={styles.optionPrice}>
                        + Rs {option.extraPrice}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.divider} />
          </View>
        ))}

        {/* Section 6: Restaurant Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Restaurant</Text>
          <View style={styles.restaurantInfoRow}>
            <Text style={styles.bodyText}>{restaurantStatus}</Text>
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

      {/* Section 7: Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom || Spacing.reg },
        ]}
      >
        <View style={styles.quantitySelector}>
          <Pressable
            style={[
              styles.quantityButton,
              quantity <= 1 && styles.quantityButtonDisabled,
            ]}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            accessibilityRole="button"
            accessibilityLabel="Decrease quantity"
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </Pressable>
          <Text style={styles.quantityCount}>{quantity}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => setQuantity((q) => Math.min(99, q + 1))}
            accessibilityRole="button"
            accessibilityLabel="Increase quantity"
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          accessibilityRole="button"
          accessibilityLabel="Add to cart"
        >
          <Text style={styles.addToCartText}>Add to cart</Text>
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
  backButton: {
    position: "absolute",
    left: Spacing.reg,
    padding: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
  },
  heroHeartButton: {
    position: "absolute",
    right: Spacing.reg,
    padding: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.35)",
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
  dishInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dishInfoLeft: {
    flex: 1,
    gap: Spacing.xs,
    marginRight: Spacing.md,
  },
  dishInfoRight: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  dishName: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.black1,
  },
  restaurantName: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
  openUntil: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.primary,
  },
  shareButton: {
    padding: Spacing.xs,
  },
  deliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  deliveryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  deliveryText: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
  },
  distanceText: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
  },
  minimumOrder: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
  sectionHeading: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.black2,
    marginBottom: Spacing.xs,
  },
  bodyText: {
    fontSize: FontSizes.sm,
    color: Colors.gray1,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 44,
  },
  optionLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.gray1,
  },
  optionPrice: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
  restaurantInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  showMoreLink: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
    gap: Spacing.md,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gray4,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: {
    borderColor: Colors.gray5,
    opacity: 0.4,
  },
  quantityButtonText: {
    fontSize: FontSizes.xl,
    color: Colors.black2,
    lineHeight: FontSizes.xl + 2,
  },
  quantityCount: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black2,
    minWidth: 24,
    textAlign: "center",
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
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

export default DishDetail;
