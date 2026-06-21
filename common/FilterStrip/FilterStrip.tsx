import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";

const FILTERS = ["Delivery", "Pickup", "Offers", "Price"] as const;

interface FilterStripProps {
  activeFilters: string[];
  onFilterChange: (filter: string) => void;
  onSortPress: () => void;
}

const FilterStrip = ({
  activeFilters,
  onFilterChange,
  onSortPress,
}: FilterStripProps) => {
  return (
    <View style={styles.row}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilters.includes(filter);
          return (
            <Pressable
              key={filter}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onFilterChange(filter)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={filter}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        style={styles.sortButton}
        onPress={onSortPress}
        accessibilityRole="button"
        accessibilityLabel="Sort and filter"
      >
        <MaterialIcons name="filter-list" size={22} color={Colors.gray3} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.reg,
    gap: Spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primaryLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: "500",
  },
  chipTextActive: {
    color: Colors.white,
  },
  sortButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
});

export default FilterStrip;
