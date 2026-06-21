import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import DishCard from "common/DishCard";
import FilterStrip from "common/FilterStrip";
import AppHeader from "common/AppHeader";
import { useDishSearch } from "hooks/useDishSearch";
import SkeletonCard from "screens/Home/components/SkeletonCard";
import { Dish } from "types/home";
import { wp } from "utils/dimensions";

const CARD_WIDTH = wp(90);
const SKELETON_HEIGHT = 260;

const DishSearch = () => {
  const { query = "", category = "" } = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  const searchTerm = query || category;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useDishSearch({ query, category, filters: activeFilters });

  const dishes = useMemo(
    () => data?.pages.flatMap((p) => p.dishes) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;

  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  }, []);

  const toggleFavourite = useCallback((dish: Dish) => {
    // TODO: Replace with API call + optimistic update when backend is ready
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      next.has(dish.id) ? next.delete(dish.id) : next.add(dish.id);
      return next;
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Dish }) => (
      <DishCard
        item={item}
        onPress={() => {}}
        width={CARD_WIDTH}
        isFavourited={favouriteIds.has(item.id)}
        onFavouritePress={toggleFavourite}
      />
    ),
    [favouriteIds, toggleFavourite],
  );

  const renderFooter = useCallback(
    () =>
      isFetchingNextPage ? (
        <ActivityIndicator color={Colors.primary} style={styles.footerLoader} />
      ) : null,
    [isFetchingNextPage],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          No results found for "{searchTerm}"
        </Text>
        <Text style={styles.emptyHint}>Try a different search term</Text>
      </View>
    ),
    [searchTerm],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader
        title="Dishes"
        placeholder="Search for dishes"
        defaultQuery={searchTerm}
        onSearch={(q) =>
          router.push({ pathname: "/(tabs)/dishSearch", params: { query: q } })
        }
        standalone
      />

      <Text style={styles.resultsSummary}>
        {total} Search result{total !== 1 ? "s" : ""}
        {searchTerm ? ` for ${searchTerm}` : ""}
      </Text>

      <FilterStrip
        activeFilters={activeFilters}
        onFilterChange={toggleFilter}
        onSortPress={() => {}}
      />

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((k) => (
            <SkeletonCard key={k} width={CARD_WIDTH} height={SKELETON_HEIGHT} />
          ))}
        </View>
      ) : (
        <FlashList
          data={dishes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resultsSummary: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  list: {
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  skeletonContainer: {
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.black2,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: FontSizes.sm,
    color: Colors.gray3,
  },
});

export default DishSearch;
