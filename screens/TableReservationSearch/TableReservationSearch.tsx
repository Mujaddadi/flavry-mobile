import { FlashList } from "@shopify/flash-list";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import AppHeader from "common/AppHeader";
import ReservationPickers from "common/ReservationPickers";
import { useTableReservationSearch } from "hooks/useTableReservationSearch";
import { ReservationRestaurant } from "types/reservation";
import { hp, wp } from "utils/dimensions";
import {
  formatDisplayDate,
  formatTime,
  makeDates,
} from "utils/reservationUtils";
import SkeletonCard from "screens/Home/components/SkeletonCard";

const CARD_IMAGE_HEIGHT = hp(18);
const ICON_SM = wp(3.5);
const ICON_MD = wp(4.5);
const SKELETON_HEIGHT = 300;

const formatDateLabel = (d: dayjs.Dayjs): string => {
  const today = dayjs();
  if (d.isSame(today, "day")) return "Today";
  if (d.isSame(today.add(1, "day"), "day")) return "Tmrw";
  return d.format("ddd");
};

// ─── Restaurant card ─────────────────────────────────────────────────────────

interface CardProps {
  item: ReservationRestaurant;
  selectedDate: string;
  partySize: number;
  selectedTime: string;
  isFavourited: boolean;
  onTimeSelect: (time: string) => void;
  onFavouritePress: () => void;
  onPress: () => void;
}

const RestaurantCard = ({
  item,
  selectedDate,
  partySize,
  selectedTime,
  isFavourited,
  onTimeSelect,
  onFavouritePress,
  onPress,
}: CardProps) => {
  const dateLabel = formatDisplayDate(selectedDate);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.tagline}, Rs ${item.price}`}
      style={styles.card}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          accessibilityLabel={item.name}
        />
        {item.discount && (
          <View style={styles.discountBadge}>
            <MaterialIcons
              name="local-offer"
              size={ICON_SM}
              color={Colors.white}
            />
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
        <Pressable
          style={styles.heartButton}
          onPress={onFavouritePress}
          accessibilityRole="button"
          accessibilityLabel={
            isFavourited ? "Remove from favourites" : "Add to favourites"
          }
        >
          <MaterialIcons
            name={isFavourited ? "favorite" : "favorite-border"}
            size={ICON_MD}
            color={isFavourited ? Colors.primary : Colors.white}
          />
        </Pressable>
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.price}>Rs {item.price}</Text>
        </View>
        <Text style={styles.tagline}>{item.tagline}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialIcons
              name="calendar-today"
              size={ICON_SM}
              color={Colors.gray3}
            />
            <Text style={styles.metaText}>{dateLabel}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="person" size={ICON_SM} color={Colors.gray3} />
            <Text style={styles.metaText}>{partySize} People</Text>
          </View>
        </View>

        {/* Available times */}
        <Text style={styles.availableLabel}>Available times</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeSlotsContent}
        >
          {item.availableTimes.map((slot) => {
            const isSelected = slot === selectedTime;
            return (
              <Pressable
                key={slot}
                style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                onPress={() => onTimeSelect(slot)}
                accessibilityRole="button"
                accessibilityLabel={`${formatTime(slot)}, select this time slot`}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    isSelected && styles.timeChipTextSelected,
                  ]}
                >
                  {formatTime(slot)}
                </Text>
              </Pressable>
            );
          })}
          <View style={styles.moreChip}>
            <Text style={styles.moreChipText}>{">"}</Text>
          </View>
        </ScrollView>
      </View>
    </Pressable>
  );
};

// ─── Main screen ─────────────────────────────────────────────────────────────

const TableReservationSearch = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(dayjs().toISOString());
  const [selectedTime, setSelectedTime] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<
    Record<string, string>
  >({});
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [pickerType, setPickerType] = useState<
    "date" | "time" | "partySize" | null
  >(null);

  const dates = useMemo(() => makeDates(), []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTableReservationSearch({
      date: selectedDate,
      time: selectedTime,
      partySize,
    });

  const restaurants = useMemo(
    () => data?.pages.flatMap((p) => p.restaurants) ?? [],
    [data],
  );
  const total = data?.pages[0]?.total ?? 0;

  const getSlot = useCallback(
    (r: ReservationRestaurant) =>
      selectedTimeSlots[r.id] ?? r.availableTimes[0] ?? selectedTime,
    [selectedTimeSlots, selectedTime],
  );

  const toggleFavourite = useCallback((id: string) => {
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ReservationRestaurant }) => (
      <RestaurantCard
        item={item}
        selectedDate={selectedDate}
        partySize={partySize}
        selectedTime={getSlot(item)}
        isFavourited={favouriteIds.has(item.id)}
        onTimeSelect={(t) =>
          setSelectedTimeSlots((prev) => ({ ...prev, [item.id]: t }))
        }
        onFavouritePress={() => toggleFavourite(item.id)}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/reserveTable",
            params: {
              restaurantId: item.id,
              restaurantName: item.name,
              restaurantImage: item.image,
              restaurantTagline: item.tagline,
              restaurantPrice: String(item.price),
              restaurantRating: String(item.rating),
              restaurantReviewCount: String(item.reviewCount),
              restaurantCategory: item.category,
              date: selectedDate,
              time: getSlot(item),
              partySize: String(partySize),
            },
          })
        }
      />
    ),
    [
      selectedDate,
      partySize,
      favouriteIds,
      getSlot,
      toggleFavourite,
      selectedTimeSlots,
      router,
    ],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
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
          No restaurants available for your selection
        </Text>
        <Pressable
          onPress={() => {
            setSelectedDate(dayjs().toISOString());
            setSelectedTime("19:00");
            setPartySize(2);
          }}
          accessibilityRole="button"
        >
          <Text style={styles.emptyLink}>Change filters</Text>
        </Pressable>
      </View>
    ),
    [],
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <AppHeader
        title="Reservations"
        placeholder="Search for restaurants"
        onSearch={() => {}}
        standalone
      />

      {/* Result count */}
      <Text style={styles.resultCount}>
        {total} Search result for table reservations
      </Text>

      {/* Filter bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        <Pressable
          style={styles.filterChip}
          onPress={() => setPickerType("date")}
          accessibilityRole="button"
          accessibilityLabel={`Date filter, ${formatDisplayDate(selectedDate)}`}
        >
          <MaterialIcons
            name="calendar-today"
            size={ICON_SM}
            color={Colors.black1}
          />
          <Text style={styles.filterChipText}>Date</Text>
        </Pressable>

        <Pressable
          style={styles.filterChip}
          onPress={() => setPickerType("time")}
          accessibilityRole="button"
          accessibilityLabel={`Time filter, ${formatTime(selectedTime)}`}
        >
          <MaterialIcons name="schedule" size={ICON_SM} color={Colors.black1} />
          <Text style={styles.filterChipText}>Time</Text>
        </Pressable>

        <Pressable
          style={styles.filterChip}
          onPress={() => setPickerType("partySize")}
          accessibilityRole="button"
          accessibilityLabel={`Party size filter, ${partySize} people`}
        >
          <MaterialIcons name="person" size={ICON_SM} color={Colors.black1} />
          <Text style={styles.filterChipText}>Party size</Text>
        </Pressable>

        <Pressable
          style={styles.filterChip}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Price filter"
        >
          <Text style={styles.filterChipText}>Price</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={ICON_SM}
            color={Colors.black1}
          />
        </Pressable>

        <Pressable
          style={styles.filterIconBtn}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="More filters"
        >
          <MaterialIcons
            name="filter-list"
            size={ICON_MD}
            color={Colors.black1}
          />
        </Pressable>
      </ScrollView>

      {/* Date strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateStrip}
      >
        {dates.map((d, i) => {
          const isSelected = d.isSame(dayjs(selectedDate), "day");
          return (
            <Pressable
              key={i}
              style={[styles.dateChip, isSelected && styles.dateChipSelected]}
              onPress={() => setSelectedDate(d.toISOString())}
              accessibilityRole="button"
              accessibilityLabel={`Select ${d.format("dddd D MMMM")}`}
            >
              <Text
                style={[
                  styles.dateChipDay,
                  isSelected && styles.dateChipTextSelected,
                ]}
              >
                {formatDateLabel(d)}
              </Text>
              <Text
                style={[
                  styles.dateChipNum,
                  isSelected && styles.dateChipTextSelected,
                ]}
              >
                {d.format("D MMM")}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* List */}
      {isLoading ? (
        <ScrollView contentContainerStyle={styles.skeletonContainer}>
          {[1, 2, 3].map((k) => (
            <SkeletonCard
              key={k}
              width={wp(100) - Spacing.reg * 2}
              height={SKELETON_HEIGHT}
            />
          ))}
        </ScrollView>
      ) : (
        <FlashList
          data={restaurants}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ReservationPickers
        pickerType={pickerType}
        onClose={() => setPickerType(null)}
        date={selectedDate}
        onDateChange={setSelectedDate}
        time={selectedTime}
        onTimeChange={setSelectedTime}
        partySize={partySize}
        onPartySizeChange={setPartySize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resultCount: {
    fontSize: FontSizes.sm,
    color: Colors.black1,
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.xs,
  },
  // Filter bar
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.reg,
    paddingBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
  },
  filterChipText: {
    fontSize: FontSizes.xs,
    color: Colors.black1,
  },
  filterIconBtn: {
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 20,
    padding: Spacing.xs,
    backgroundColor: Colors.white,
  },
  // Date strip — compact 2-line chips
  dateStrip: {
    flexDirection: "row",
    paddingHorizontal: Spacing.reg,
    paddingBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  dateChip: {
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray4,
    minWidth: wp(12),
  },
  dateChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateChipDay: {
    fontSize: FontSizes.xs - 1,
    color: Colors.gray2,
  },
  dateChipNum: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    color: Colors.black1,
  },
  dateChipTextSelected: {
    color: Colors.white,
  },
  // Restaurant card
  card: {
    backgroundColor: Colors.white,
  },
  imageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: CARD_IMAGE_HEIGHT,
    resizeMode: "cover",
    backgroundColor: Colors.gray5,
  },
  discountBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 20,
  },
  discountText: {
    color: Colors.white,
    fontSize: FontSizes.xs - 1,
    fontWeight: "700",
  },
  heartButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    padding: Spacing.xs,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
  },
  cardBody: {
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restaurantName: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black1,
    flex: 1,
    marginRight: Spacing.sm,
  },
  price: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  tagline: {
    fontSize: FontSizes.xs,
    color: Colors.gray2,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: FontSizes.xs,
    color: Colors.gray2,
  },
  availableLabel: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    color: Colors.black2,
  },
  timeSlotsContent: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  timeChip: {
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.white,
  },
  timeChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeChipText: {
    fontSize: FontSizes.xs,
    color: Colors.black1,
  },
  timeChipTextSelected: {
    color: Colors.white,
    fontWeight: "600",
  },
  moreChip: {
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.white,
    justifyContent: "center",
  },
  moreChipText: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
  separator: {
    height: 8,
    backgroundColor: Colors.gray5,
  },
  footerLoader: {
    padding: Spacing.reg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
    textAlign: "center",
  },
  emptyLink: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  skeletonContainer: {
    padding: Spacing.reg,
    gap: Spacing.md,
  },
});

export default TableReservationSearch;
