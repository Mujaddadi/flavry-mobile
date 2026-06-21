import { FlashList } from "@shopify/flash-list";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { Dish, Restaurant } from "types/home";
import { wp } from "utils/dimensions";

import { SectionType } from "types/common";

import SkeletonCard from "./SkeletonCard";

interface Props<T extends Dish | Restaurant> {
  title: string;
  type: SectionType;
  data?: T[];
  loading: boolean;
  renderCard: (item: T) => React.ReactElement;
}

const DISH_CARD_WIDTH = wp(72);
const RESTAURANT_CARD_WIDTH = wp(75);

const SectionCarousel = <T extends Dish | Restaurant>({
  title,
  type,
  data,
  loading,
  renderCard,
}: Props<T>) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems[0]?.index != null)
        setActiveIndex(viewableItems[0].index);
    },
    [],
  );

  const cardWidth = type === "dish" ? DISH_CARD_WIDTH : RESTAURANT_CARD_WIDTH;

  const renderItem = useCallback(
    ({ item }: { item: T }) => renderCard(item),
    [renderCard],
  );

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>{title}</Text>
        <View style={styles.skeletonRow}>
          <SkeletonCard width={cardWidth} height={220} />
          <SkeletonCard width={cardWidth} height={220} />
        </View>
      </View>
    );
  }

  if (!data?.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      <FlashList<T>
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      <View style={styles.dots}>
        {data?.map((item, i) => (
          <View
            key={item?.id}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  heading: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black2,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.reg,
  },
  list: {
    paddingHorizontal: Spacing.reg,
  },
  skeletonRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.reg,
    gap: Spacing.md,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gray4,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 12,
  },
});

export default SectionCarousel;
