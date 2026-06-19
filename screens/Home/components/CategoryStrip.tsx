import { FlashList } from "@shopify/flash-list";
import { Image, StyleSheet, Text, Pressable, View } from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { Category } from "types/home";
import { wp } from "utils/dimensions";

import SkeletonCard from "./SkeletonCard";

interface CategoryStripProps {
  categories?: Category[];
  loading: boolean;
  onSelect: (category: Category) => void;
}

const ITEM_SIZE = wp(20);

const CategoryItem = ({
  item,
  onSelect,
}: {
  item: Category;
  onSelect: (category: Category) => void;
}) => (
  <Pressable
    style={styles.item}
    onPress={() => onSelect(item)}
    accessibilityRole="button"
    accessibilityLabel={item.name}
  >
    <Image source={{ uri: item.image }} style={styles.image} />
    <Text style={styles.label} numberOfLines={1}>
      {item.name}
    </Text>
  </Pressable>
);

const CategoryStrip = ({
  categories,
  loading,
  onSelect,
}: CategoryStripProps) => {
  if (loading) {
    return (
      <View style={styles.skeletonRow}>
        {[1, 2, 3, 4].map((k) => (
          <SkeletonCard key={k} width={ITEM_SIZE} height={ITEM_SIZE + 24} />
        ))}
      </View>
    );
  }

  if (!categories?.length) return null;

  return (
    <FlashList
      data={categories}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CategoryItem item={item} onSelect={onSelect} />
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.reg,
  },
  skeletonRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.reg,
    gap: Spacing.sm,
  },
  item: {
    alignItems: "center",
    marginRight: Spacing.sm,
    width: ITEM_SIZE,
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 8,
  },
  label: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.xs,
    color: Colors.gray1,
    textAlign: "center",
  },
});

export default CategoryStrip;
