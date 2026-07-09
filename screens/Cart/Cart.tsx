import { zodResolver } from "@hookform/resolvers/zod";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { usePopularAddons } from "hooks/usePopularAddons";
import { useCartStore } from "store/cartStore";
import { CartItem, PopularAddon } from "types/cart";
import { wp } from "utils/dimensions";

const ADDON_SIZE = wp(25);
const ITEM_IMAGE_SIZE = wp(16);
const LOGO_SIZE = wp(10);

// ── Voucher validation ─────────────────────────────────────────────────────

const voucherSchema = z.object({
  code: z.string().min(1, "Enter a voucher code"),
});
type VoucherForm = z.infer<typeof voucherSchema>;

// ── Sub-components ─────────────────────────────────────────────────────────

interface AddonTileProps {
  addon: PopularAddon;
  onAdd: () => void;
  isAdded: boolean;
}

const AddonTile = ({ addon, onAdd, isAdded }: AddonTileProps) => (
  <View style={styles.addonTile}>
    <View>
      <Image
        source={{ uri: addon.image }}
        style={styles.addonImage}
        accessibilityLabel={addon.name}
      />
      <Pressable
        style={styles.addonAddBtn}
        onPress={isAdded ? undefined : onAdd}
        accessibilityRole="button"
        accessibilityLabel={
          isAdded ? `${addon.name} added to cart` : `Add ${addon.name} to cart`
        }
      >
        <MaterialIcons
          name={isAdded ? "check" : "add"}
          size={14}
          color={Colors.white}
        />
      </Pressable>
    </View>
    <Text style={styles.addonName} numberOfLines={1}>
      {addon.name}
    </Text>
    <Text style={styles.addonPrice}>Rs.{addon.price}</Text>
  </View>
);

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (id: string, quantity: number) => void;
}

const CartItemRow = ({ item, onQuantityChange }: CartItemRowProps) => (
  <View style={styles.itemRow}>
    <Image
      source={{ uri: item.image }}
      style={styles.itemImage}
      accessibilityLabel={item.name}
    />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDesc} numberOfLines={2}>
        {item.description}
      </Text>
    </View>
    <View style={styles.itemRight}>
      <View style={styles.quantityRow}>
        <Pressable
          style={styles.qtyBtn}
          onPress={() => onQuantityChange(item.id, item.quantity - 1)}
          accessibilityRole="button"
          accessibilityLabel={`Decrease quantity of ${item.name}`}
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </Pressable>
        <View style={styles.qtyInput}>
          <Text style={styles.qtyCount}>{item.quantity}</Text>
        </View>
        <Pressable
          style={styles.qtyBtn}
          onPress={() => onQuantityChange(item.id, item.quantity + 1)}
          accessibilityRole="button"
          accessibilityLabel={`Increase quantity of ${item.name}`}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </Pressable>
      </View>
      <Text style={styles.itemPrice}>Rs.{item.price * item.quantity}</Text>
    </View>
  </View>
);

interface RestaurantGroup {
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  items: CartItem[];
  total: number;
}

interface RestaurantGroupCardProps {
  group: RestaurantGroup;
}

const RestaurantGroupCard = ({ group }: RestaurantGroupCardProps) => {
  const { data: addons = [] } = usePopularAddons(group.restaurantId);
  const instructions = useCartStore(
    (s) => s.specialInstructions[group.restaurantId] ?? "",
  );
  const cartItems = useCartStore((s) => s.items);
  const { updateQuantity, setSpecialInstructions, addItem } = useCartStore();

  const handleAddAddon = useCallback(
    (addon: PopularAddon) => {
      addItem({
        id: `${group.restaurantId}-addon-${addon.id}`,
        dishId: addon.id,
        name: addon.name,
        description: "",
        image: addon.image,
        price: addon.price,
        quantity: 1,
        restaurantId: group.restaurantId,
        restaurantName: group.restaurantName,
        restaurantLogo: group.restaurantLogo,
      });
    },
    [addItem, group],
  );

  const renderAddon = useCallback(
    ({ item }: { item: PopularAddon }) => (
      <AddonTile
        addon={item}
        onAdd={() => handleAddAddon(item)}
        isAdded={cartItems.some(
          (ci) => ci.id === `${group.restaurantId}-addon-${item.id}`,
        )}
      />
    ),
    [handleAddAddon, cartItems, group.restaurantId],
  );

  return (
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        {group.restaurantLogo ? (
          <Image
            source={
              typeof group.restaurantLogo === "number"
                ? group.restaurantLogo
                : { uri: group.restaurantLogo }
            }
            style={styles.restaurantLogo}
            accessibilityLabel={group.restaurantName}
          />
        ) : (
          <View style={styles.restaurantLogoPlaceholder}>
            <MaterialIcons
              name="restaurant"
              size={wp(5)}
              color={Colors.gray3}
            />
          </View>
        )}
        <Text style={styles.restaurantName}>{group.restaurantName}</Text>
      </View>

      {group.items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onQuantityChange={updateQuantity}
        />
      ))}

      <Text style={styles.groupTotal}>Total Rs.{group.total}</Text>

      <Text style={styles.addonsHeading}>Popular Add ons</Text>
      <FlatList
        data={addons}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderAddon}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.addonsList}
      />

      <TextInput
        value={instructions}
        onChangeText={(text) =>
          setSpecialInstructions(group.restaurantId, text)
        }
        placeholder="Special instructions to the restaurant"
        placeholderTextColor={Colors.gray3}
        accessibilityLabel={`Special instructions for ${group.restaurantName}`}
        style={styles.instructionsInput}
      />
    </View>
  );
};

// ── Empty State ────────────────────────────────────────────────────────────

const EmptyCart = () => (
  <View style={styles.emptyContainer}>
    <MaterialIcons name="shopping-cart" size={wp(16)} color={Colors.gray4} />
    <Text style={styles.emptyTitle}>Your cart is empty</Text>
    <Text style={styles.emptySubtitle}>
      Add dishes from the home screen to get started
    </Text>
  </View>
);

// ── Main Screen ────────────────────────────────────────────────────────────

const Cart = () => {
  const insets = useSafeAreaInsets();
  const { items, voucher, discount, applyVoucher, clearVoucher } =
    useCartStore();

  const restaurantGroups = useMemo<RestaurantGroup[]>(() => {
    const map = new Map<string, RestaurantGroup>();
    items.forEach((item) => {
      if (!map.has(item.restaurantId)) {
        map.set(item.restaurantId, {
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          restaurantLogo: item.restaurantLogo,
          items: [],
          total: 0,
        });
      }
      const group = map.get(item.restaurantId)!;
      group.items.push(item);
      group.total += item.price * item.quantity;
    });
    return Array.from(map.values());
  }, [items]);

  const subtotal = useMemo(
    () => restaurantGroups.reduce((sum, g) => sum + g.total, 0),
    [restaurantGroups],
  );
  const grandTotal = Math.max(0, subtotal - discount);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VoucherForm>({
    resolver: zodResolver(voucherSchema),
    defaultValues: { code: voucher },
  });

  const handleApplyVoucher = handleSubmit(({ code }) => {
    // TODO: Call voucher validation API; mock applies no discount until backend ready
    applyVoucher(code.trim(), 0);
  });

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {restaurantGroups.map((group) => (
          <RestaurantGroupCard key={group.restaurantId} group={group} />
        ))}

        {/* Voucher */}
        <View style={styles.voucherSection}>
          <Text style={styles.voucherLabel}>Add voucher</Text>
          <View style={styles.voucherRow}>
            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.voucherInput}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Voucher code"
                  placeholderTextColor={Colors.gray3}
                  accessibilityLabel="Voucher code"
                  autoCapitalize="characters"
                />
              )}
            />
            <Pressable
              style={styles.applyBtn}
              onPress={voucher ? clearVoucher : handleApplyVoucher}
              accessibilityRole="button"
              accessibilityLabel={voucher ? "Remove voucher" : "Apply voucher"}
            >
              <Text style={styles.applyBtnText}>
                {voucher ? "Remove" : "Apply"}
              </Text>
            </Pressable>
          </View>
          {errors.code && (
            <Text style={styles.errorText}>{errors.code.message}</Text>
          )}
          {voucher && discount > 0 && (
            <Text style={styles.discountText}>Discount: Rs.{discount} off</Text>
          )}
        </View>
      </ScrollView>

      {/* Sticky Checkout Bar */}
      <View
        style={[
          styles.checkoutWrapper,
          { paddingBottom: insets.bottom || Spacing.reg },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.checkoutBar,
            pressed && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Checkout, total RS. ${grandTotal}`}
        >
          <Text style={styles.checkoutLabel}>Checkout</Text>
          <Text style={styles.checkoutTotal}>RS. {grandTotal}</Text>
        </Pressable>
      </View>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },

  // Restaurant group card
  groupCard: {
    margin: Spacing.reg,
    borderRadius: 8,
    paddingBottom: Spacing.md,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.reg,
  },
  restaurantLogo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 6,
  },
  restaurantLogoPlaceholder: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 6,
    backgroundColor: Colors.gray5,
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.black1,
  },

  // Cart item row
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.md,
  },
  itemImage: {
    width: ITEM_IMAGE_SIZE,
    height: ITEM_IMAGE_SIZE,
    borderRadius: 8,
    backgroundColor: Colors.gray5,
  },
  itemInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  itemName: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.black1,
  },
  itemDesc: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
  itemRight: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    lineHeight: FontSizes.md + 2,
  },
  qtyInput: {
    width: 36,
    height: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyCount: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.black1,
  },
  itemPrice: {
    fontSize: FontSizes.sm,
    color: Colors.black1,
  },

  // Group total
  groupTotal: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.black1,
    textAlign: "right",
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  // Add-ons
  addonsHeading: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.black2,
    paddingHorizontal: Spacing.reg,
    marginBottom: Spacing.sm,
  },
  addonsList: {
    paddingHorizontal: Spacing.reg,
    gap: Spacing.md,
  },
  addonTile: {
    width: ADDON_SIZE,
    marginRight: Spacing.md,
  },
  addonImage: {
    width: ADDON_SIZE,
    height: ADDON_SIZE,
    borderRadius: 8,
    backgroundColor: Colors.gray5,
  },
  addonAddBtn: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addonName: {
    fontSize: FontSizes.xs,
    color: Colors.gray1,
    marginTop: Spacing.xs,
  },
  addonPrice: {
    fontSize: FontSizes.xs,
    color: Colors.gray1,
  },

  // Special instructions
  instructionsInput: {
    marginHorizontal: Spacing.reg,
    marginTop: Spacing.md,
    fontSize: FontSizes.xs,
    color: Colors.gray1,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },

  // Voucher
  voucherSection: {
    marginHorizontal: Spacing.reg,
    marginTop: Spacing.sm,
  },
  voucherLabel: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  voucherRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    borderRadius: 8,
    overflow: "hidden",
  },
  voucherInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.sm,
    color: Colors.black1,
    minHeight: 44,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  applyBtnText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: "700",
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  discountText: {
    fontSize: FontSizes.xs,
    color: Colors.logoGreen,
    marginTop: Spacing.xs,
  },

  // Checkout bar
  checkoutWrapper: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
  },
  checkoutBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.md,
    borderRadius: 10,
  },
  checkoutLabel: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.white,
  },
  checkoutTotal: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.white,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    padding: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.black2,
  },
  emptySubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.gray3,
    textAlign: "center",
  },
});

export default Cart;
