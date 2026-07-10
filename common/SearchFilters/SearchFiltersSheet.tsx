import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import {
  DEFAULT_SEARCH_FILTERS,
  SearchEnvironmentFilter,
  SearchFilterContext,
  SearchFilterState,
  SearchServiceFilter,
  SearchSortOption,
} from "types/searchFilters";
import { hp } from "utils/dimensions";

const ORANGE = Colors.primary;
const SOFT_ORANGE = "#FFF2EC";
const PANEL_SHADOW = "rgba(0,0,0,0.12)";
const MAX_PRICE = 11999;
const MAX_DISTANCE = 50;
const IS_TEST = process.env.NODE_ENV === "test";

type SectionKey = "sort" | "environments" | "services" | "cuisines";

interface Option<T extends string> {
  label: string;
  value: T;
  count: number;
}

interface SearchFiltersSheetProps {
  visible: boolean;
  context: SearchFilterContext;
  value: SearchFilterState;
  onApply: (next: SearchFilterState) => void;
  onReset: () => void;
  onClose: () => void;
  initialSection?: "price" | "sort" | "all";
}

const ENVIRONMENT_OPTIONS: Option<SearchEnvironmentFilter>[] = [
  { label: "Modern", value: "modern", count: 6755 },
  { label: "Decent", value: "decent", count: 5499 },
  { label: "Fast Food", value: "fastFood", count: 5496 },
  { label: "Comfortable", value: "comfortable", count: 5404 },
  { label: "Clean", value: "clean", count: 5224 },
  { label: "Traditional", value: "traditional", count: 1122 },
  { label: "Asthetic", value: "aesthetic", count: 639 },
];

const SERVICE_OPTIONS: Option<SearchServiceFilter>[] = [
  { label: "Digital Menu", value: "digitalMenu", count: 7149 },
  { label: "Pickup", value: "pickup", count: 6928 },
  { label: "Online Ordering", value: "onlineOrdering", count: 6693 },
  { label: "Table Reservation", value: "tableReservation", count: 6597 },
  { label: "Delivery", value: "delivery", count: 6071 },
  { label: "Restroom", value: "restroom", count: 4834 },
  { label: "Take Away", value: "takeAway", count: 3304 },
  { label: "Dine In", value: "dineIn", count: 2532 },
  { label: "Toilets", value: "toilets", count: 576 },
  { label: "Kids Menu", value: "kidsMenu", count: 136 },
];

const CUISINE_OPTIONS: Option<string>[] = [
  { label: "Italian", value: "Italian", count: 2920 },
  { label: "American", value: "American", count: 2295 },
  { label: "Pakistani", value: "Pakistani", count: 638 },
  { label: "Turkish", value: "Turkish", count: 526 },
  { label: "Chinese", value: "Chinese", count: 356 },
  { label: "Continental", value: "Continental", count: 113 },
  { label: "Italian", value: "Italian-2", count: 87 },
  { label: "French", value: "French", count: 81 },
  { label: "Fast Food Or Italian", value: "Fast Food Or Italian", count: 32 },
  { label: "Fast Food", value: "Fast Food", count: 17 },
];

const SORT_OPTIONS: Option<SearchSortOption>[] = [
  { label: "Recommended", value: "recommended", count: 0 },
  { label: "Top Rated", value: "rating", count: 0 },
  { label: "Nearest", value: "distance", count: 0 },
  { label: "Fastest Delivery", value: "deliveryTime", count: 0 },
];

const isSelected = <T extends string>(values: T[], value: T) =>
  values.includes(value);

const toggleValue = <T extends string>(values: T[], value: T) =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

const FilterOption = <T extends string>({
  option,
  selected,
  onPress,
}: {
  option: Option<T>;
  selected: boolean;
  onPress: () => void;
}) => {
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = (toValue: number) => {
    if (IS_TEST) {
      scale.setValue(toValue);
      return;
    }
    Animated.spring(scale, {
      toValue,
      friction: 6,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const label =
    option.count > 0 ? `${option.label} (${option.count})` : option.label;

  return (
    <Animated.View style={[styles.optionWrap, { transform: [{ scale }] }]}>
      <Pressable
        style={[styles.optionPill, selected && styles.optionPillSelected]}
        onPress={onPress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`${selected ? "Deselect" : "Select"} ${option.label}`}
      >
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const RangeCard = ({
  icon,
  title,
  value,
  minLabel,
  maxLabel,
  fillStart = 0,
  fillEnd = 1,
  onDecrease,
  onIncrease,
}: {
  icon: "local-offer" | "place";
  title: string;
  value: string;
  minLabel: string;
  maxLabel: string;
  fillStart?: number;
  fillEnd?: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) => (
  <View style={styles.rangeCard}>
    <View style={styles.rangeTitleRow}>
      <View style={styles.iconBubble}>
        <MaterialIcons name={icon} size={18} color={ORANGE} />
      </View>
      <View>
        <Text style={styles.rangeTitle}>{title}</Text>
        <Text style={styles.rangeValue}>{value}</Text>
      </View>
    </View>
    <View style={styles.sliderRow}>
      <Pressable
        style={styles.sliderTouch}
        onPress={onDecrease}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${title.toLowerCase()}`}
      >
        <View style={styles.sliderThumb} />
      </Pressable>
      <View style={styles.sliderTrack}>
        <View
          style={[
            styles.sliderFill,
            {
              left: `${Math.max(0, Math.min(1, fillStart)) * 100}%`,
              right: `${(1 - Math.max(0, Math.min(1, fillEnd))) * 100}%`,
            },
          ]}
        />
      </View>
      <Pressable
        style={styles.sliderTouch}
        onPress={onIncrease}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${title.toLowerCase()}`}
      >
        <View style={styles.sliderThumb} />
      </Pressable>
    </View>
    <View style={styles.rangeLabels}>
      <Text style={styles.rangeLabel}>{minLabel}</Text>
      <Text style={styles.rangeLabel}>{maxLabel}</Text>
    </View>
  </View>
);

const CheckboxRow = ({
  icon,
  label,
  checked,
  onPress,
}: {
  icon: "local-shipping" | "shopping-bag";
  label: string;
  checked: boolean;
  onPress: () => void;
}) => (
  <Pressable
    style={styles.checkboxRow}
    onPress={onPress}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
    accessibilityLabel={label}
  >
    <MaterialIcons name={icon} size={22} color={ORANGE} />
    <Text style={styles.checkboxLabel}>{label}</Text>
    <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
      {checked && <MaterialIcons name="check" size={16} color={Colors.white} />}
    </View>
  </Pressable>
);

const Section = ({
  icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: "sort" | "eco" | "restaurant" | "ramen-dining";
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  const [progress] = useState(() => new Animated.Value(open ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: IS_TEST ? 0 : 180,
      useNativeDriver: false,
    }).start();
  }, [open, progress]);

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "0deg"],
  });

  return (
    <View style={styles.section}>
      <Pressable
        style={styles.sectionHeader}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${open ? "Collapse" : "Expand"} ${title}`}
      >
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIconBubble}>
            <MaterialIcons name={icon} size={18} color={ORANGE} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={22}
            color={Colors.black1}
          />
        </Animated.View>
      </Pressable>
      {open && <View style={styles.optionGrid}>{children}</View>}
    </View>
  );
};

const SearchFiltersSheet = ({
  visible,
  context,
  value,
  onApply,
  onReset,
  onClose,
  initialSection = "all",
}: SearchFiltersSheetProps) => {
  const [draft, setDraft] = useState(value);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    {
      sort: initialSection === "sort",
      environments: initialSection === "all",
      services: true,
      cuisines: true,
    },
  );
  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [sheetOpacity] = useState(() => new Animated.Value(0));
  const [applyScale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!visible) return;
    if (IS_TEST) {
      backdropOpacity.setValue(1);
      sheetOpacity.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetOpacity, visible]);

  const showEnvironments = context !== "dish";
  const showDistance = true;
  const showPrice = true;

  const sectionOptions = useMemo(
    () => ({
      sort: SORT_OPTIONS,
      environments: ENVIRONMENT_OPTIONS,
      services: SERVICE_OPTIONS,
      cuisines: CUISINE_OPTIONS,
    }),
    [],
  );

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetDraft = () => {
    const next = context === "reservation" ? value : DEFAULT_SEARCH_FILTERS;
    setDraft(next);
    onReset();
  };

  const apply = () => {
    if (IS_TEST) {
      onApply(draft);
      return;
    }
    Animated.sequence([
      Animated.spring(applyScale, {
        toValue: 0.97,
        friction: 6,
        tension: 180,
        useNativeDriver: true,
      }),
      Animated.spring(applyScale, {
        toValue: 1,
        friction: 6,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start(() => onApply(draft));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close filters"
        />
      </Animated.View>
      <View style={styles.centerWrap} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, { opacity: sheetOpacity }]}>
          <View style={styles.header}>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
            >
              <MaterialIcons name="close" size={30} color={Colors.white} />
            </Pressable>
            <Text style={styles.headerTitle}>Filters</Text>
            <Pressable
              onPress={resetDraft}
              accessibilityRole="button"
              accessibilityLabel="Reset filters"
            >
              <Text style={styles.headerReset}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.topGrid}>
              {showPrice && (
                <RangeCard
                  icon="local-offer"
                  title="Price Range"
                  value={`Rs ${draft.priceRange[0]} - Rs ${draft.priceRange[1].toLocaleString()}`}
                  minLabel={`Rs ${draft.priceRange[0]}`}
                  maxLabel={`Rs ${draft.priceRange[1].toLocaleString()}`}
                  fillEnd={draft.priceRange[1] / MAX_PRICE}
                  onDecrease={() =>
                    setDraft((prev) => ({
                      ...prev,
                      priceRange: [
                        Math.max(1, prev.priceRange[0] - 250),
                        prev.priceRange[1],
                      ],
                    }))
                  }
                  onIncrease={() =>
                    setDraft((prev) => ({
                      ...prev,
                      priceRange: [
                        prev.priceRange[0],
                        Math.min(MAX_PRICE, prev.priceRange[1] + 250),
                      ],
                    }))
                  }
                />
              )}
              {showDistance && (
                <RangeCard
                  icon="place"
                  title="Distance Range"
                  value={`${draft.distanceRangeKm[0]} KM - ${draft.distanceRangeKm[1]} KM`}
                  minLabel={`${draft.distanceRangeKm[0]} KM`}
                  maxLabel={`${draft.distanceRangeKm[1]} KM`}
                  fillStart={draft.distanceRangeKm[0] / MAX_DISTANCE}
                  fillEnd={draft.distanceRangeKm[1] / MAX_DISTANCE}
                  onDecrease={() =>
                    setDraft((prev) => ({
                      ...prev,
                      distanceRangeKm: [
                        Math.max(0, prev.distanceRangeKm[0] - 1),
                        prev.distanceRangeKm[1],
                      ],
                    }))
                  }
                  onIncrease={() =>
                    setDraft((prev) => ({
                      ...prev,
                      distanceRangeKm: [
                        prev.distanceRangeKm[0],
                        Math.min(MAX_DISTANCE, prev.distanceRangeKm[1] + 1),
                      ],
                    }))
                  }
                />
              )}
              <CheckboxRow
                icon="local-shipping"
                label="Can Deliver"
                checked={draft.canDeliver}
                onPress={() =>
                  setDraft((prev) => ({
                    ...prev,
                    canDeliver: !prev.canDeliver,
                    services: !prev.canDeliver
                      ? Array.from(new Set([...prev.services, "delivery"]))
                      : prev.services,
                  }))
                }
              />
              <CheckboxRow
                icon="shopping-bag"
                label="Can Pickup"
                checked={draft.canPickup}
                onPress={() =>
                  setDraft((prev) => ({
                    ...prev,
                    canPickup: !prev.canPickup,
                    services: !prev.canPickup
                      ? Array.from(new Set([...prev.services, "pickup"]))
                      : prev.services,
                  }))
                }
              />
            </View>

            <Section
              icon="sort"
              title="Sort"
              open={openSections.sort}
              onToggle={() => toggleSection("sort")}
            >
              {sectionOptions.sort.map((option) => (
                <FilterOption
                  key={option.value}
                  option={option}
                  selected={draft.sort === option.value}
                  onPress={() =>
                    setDraft((prev) => ({ ...prev, sort: option.value }))
                  }
                />
              ))}
            </Section>

            {showEnvironments && (
              <Section
                icon="eco"
                title="Environments"
                open={openSections.environments}
                onToggle={() => toggleSection("environments")}
              >
                {sectionOptions.environments.map((option) => (
                  <FilterOption
                    key={option.value}
                    option={option}
                    selected={isSelected(draft.environments, option.value)}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        environments: toggleValue(
                          prev.environments,
                          option.value,
                        ),
                      }))
                    }
                  />
                ))}
              </Section>
            )}

            <Section
              icon="restaurant"
              title="Services"
              open={openSections.services}
              onToggle={() => toggleSection("services")}
            >
              {sectionOptions.services.map((option) => (
                <FilterOption
                  key={option.value}
                  option={option}
                  selected={isSelected(draft.services, option.value)}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      services: toggleValue(prev.services, option.value),
                    }))
                  }
                />
              ))}
            </Section>

            <Section
              icon="ramen-dining"
              title="Cuisines"
              open={openSections.cuisines}
              onToggle={() => toggleSection("cuisines")}
            >
              {sectionOptions.cuisines.map((option) => (
                <FilterOption
                  key={option.value}
                  option={option}
                  selected={isSelected(draft.cuisines, option.value)}
                  onPress={() =>
                    setDraft((prev) => ({
                      ...prev,
                      cuisines: toggleValue(prev.cuisines, option.value),
                    }))
                  }
                />
              ))}
            </Section>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={styles.resetAllBtn}
              onPress={resetDraft}
              accessibilityRole="button"
              accessibilityLabel="Reset all filters"
            >
              <MaterialIcons name="refresh" size={22} color={ORANGE} />
              <Text style={styles.resetAllText}>Reset All</Text>
            </Pressable>
            <Animated.View
              style={[styles.applyWrap, { transform: [{ scale: applyScale }] }]}
            >
              <Pressable
                style={styles.applyBtn}
                onPress={apply}
                accessibilityRole="button"
                accessibilityLabel="Apply filters"
              >
                <Text style={styles.applyText}>Apply Filters</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.36)",
  },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
  },
  sheet: {
    width: "100%",
    maxWidth: 760,
    maxHeight: hp(88),
    borderRadius: 14,
    backgroundColor: Colors.white,
    overflow: "hidden",
    shadowColor: Colors.black1,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ORANGE,
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: {
    flex: 1,
    marginLeft: Spacing.xl,
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: "800",
  },
  headerReset: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: "800",
  },
  content: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  topGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  rangeCard: {
    width: "48%",
    minWidth: 280,
    flexGrow: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    shadowColor: PANEL_SHADOW,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 2,
  },
  rangeTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SOFT_ORANGE,
  },
  rangeTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "800",
    color: Colors.black2,
  },
  rangeValue: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    color: ORANGE,
    fontWeight: "600",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray5,
    overflow: "hidden",
  },
  sliderFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: ORANGE,
  },
  sliderTouch: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ORANGE,
  },
  rangeLabels: {
    marginTop: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeLabel: {
    fontSize: FontSizes.xs,
    color: Colors.black2,
  },
  checkboxRow: {
    width: "48%",
    minWidth: 220,
    flexGrow: 1,
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    shadowColor: PANEL_SHADOW,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 1,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.black2,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionHeader: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  sectionIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SOFT_ORANGE,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    color: Colors.black2,
    fontWeight: "800",
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    paddingTop: Spacing.md,
  },
  optionWrap: {
    width: "48%",
    minWidth: 160,
    flexGrow: 1,
  },
  optionPill: {
    minHeight: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.gray5,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
  },
  optionPillSelected: {
    borderColor: ORANGE,
    backgroundColor: "#FFF8F4",
  },
  optionText: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: ORANGE,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
    backgroundColor: Colors.white,
  },
  resetAllBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ORANGE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  resetAllText: {
    color: ORANGE,
    fontSize: FontSizes.sm,
    fontWeight: "800",
  },
  applyWrap: {
    flex: 1,
  },
  applyBtn: {
    minHeight: 48,
    borderRadius: 6,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: "800",
  },
});

export default SearchFiltersSheet;
