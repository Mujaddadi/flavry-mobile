import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { PromoBanner } from "types/home";
import { wp } from "utils/dimensions";

import SkeletonCard from "./SkeletonCard";

interface PromoCarouselProps {
  banners?: PromoBanner[];
  loading: boolean;
}

const CARD_WIDTH = wp(90);
const CARD_HEIGHT = 140;

const BannerItem = ({ item }: { item: PromoBanner }) => (
  <Pressable
    style={({ pressed }) => pressed && { opacity: 0.9 }}
    accessibilityRole="button"
    accessibilityLabel={item.title}
  >
    <ImageBackground
      source={{ uri: item.image }}
      style={styles.banner}
      imageStyle={styles.bannerImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.bannerLabel}>RESTAURANT</Text>
        <Text style={styles.bannerTitle}>FOOD{"\n"}COMBO</Text>
        <Text style={styles.bannerLabel}>OFFERS</Text>
      </View>
    </ImageBackground>
  </Pressable>
);

const PromoCarousel = ({ banners, loading }: PromoCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlashListRef<PromoBanner>>(null);

  useEffect(() => {
    if (!banners?.length || banners.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems[0]?.index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <SkeletonCard width={CARD_WIDTH} height={CARD_HEIGHT} />
      </View>
    );
  }

  if (!banners?.length) return null;

  return (
    <View style={styles.container}>
      <FlashList
        ref={listRef}
        data={banners}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BannerItem item={item} />}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        contentContainerStyle={styles.list}
      />
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.reg,
    marginBottom: Spacing.lg,
  },
  list: {
    paddingRight: Spacing.sm,
  },
  banner: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: Spacing.sm,
    justifyContent: "center",
  },
  bannerImage: {
    borderRadius: 12,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.md,
    alignSelf: "flex-start",
    borderRadius: 12,
  },
  bannerLabel: {
    color: Colors.logoYellow,
    fontSize: FontSizes.xs,
    fontWeight: "600",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: "900",
    lineHeight: 28,
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

export default PromoCarousel;
