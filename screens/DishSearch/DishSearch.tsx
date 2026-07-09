import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import DishCard from "common/DishCard";
import FilterStrip from "common/FilterStrip";
import AppHeader from "common/AppHeader";
import { useDishSearch } from "hooks/useDishSearch";
import {
  searchResultCardStyle,
  searchResultStyles as styles,
} from "screens/searchResultStyles";
import SkeletonCard from "screens/Home/components/SkeletonCard";
import { Dish } from "types/home";
import { wp } from "utils/dimensions";
import { Colors } from "assets/styles/theme";

const CARD_WIDTH = wp(90);
const SKELETON_HEIGHT = 260;

const DishSearch = () => {
  const { query = "", category = "" } = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();
  const router = useRouter();

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
        onPress={(dish) =>
          router.push({
            pathname: "/(tabs)/dishDetail",
            params: { dishId: dish.id },
          })
        }
        isFavourited={favouriteIds.has(item.id)}
        onFavouritePress={toggleFavourite}
        style={searchResultCardStyle}
      />
    ),
    [favouriteIds, toggleFavourite, router],
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
    <View style={styles.container}>
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

export default DishSearch;
