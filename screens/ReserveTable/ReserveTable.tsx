import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { z } from "zod";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { submitTableReservation } from "apis/reservations";
import ReservationPickers from "common/ReservationPickers";
import { useHomeStore } from "store/homeStore";
import { TablePreference } from "types/reservation";
import { hp, wp } from "utils/dimensions";
import { formatDisplayDate, formatTime } from "utils/reservationUtils";

const THUMB_SIZE = wp(20);
const ICON_MD = wp(4.5);
const ICON_SM = wp(3.5);

// ─── Table preference options ─────────────────────────────────────────────────

const PREFERENCE_OPTIONS: { value: TablePreference; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
];

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  specialRequests: z.string().max(120, "Maximum 120 characters").optional(),
});

type FormData = z.infer<typeof schema>;

// ─── Screen ───────────────────────────────────────────────────────────────────

const ReserveTable = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartCount } = useHomeStore();

  const params = useLocalSearchParams<{
    restaurantId: string;
    restaurantName: string;
    restaurantImage: string;
    restaurantTagline: string;
    restaurantPrice: string;
    restaurantRating: string;
    restaurantReviewCount: string;
    restaurantCategory: string;
    date: string;
    time: string;
    partySize: string;
  }>();

  const [date, setDate] = useState(params.date ?? dayjs().toISOString());
  const [time, setTime] = useState(params.time ?? "19:00");
  const [partySize, setPartySize] = useState(Number(params.partySize) || 2);
  const [tablePreference, setTablePreference] =
    useState<TablePreference>("any");
  const [pickerType, setPickerType] = useState<
    "date" | "time" | "partySize" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const price = Number(params.restaurantPrice) || 0;
  const rating = Number(params.restaurantRating) || 0;
  const reviewCount = Number(params.restaurantReviewCount) || 0;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      specialRequests: "",
    },
  });

  const specialRequests = watch("specialRequests") ?? "";

  const onSubmit = useCallback(
    async (formData: FormData) => {
      setIsSubmitting(true);
      try {
        await submitTableReservation({
          restaurantId: params.restaurantId ?? "",
          date,
          time,
          partySize,
          tablePreference,
          specialRequests: formData.specialRequests?.replace(/<[^>]*>/g, ""),
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        });
        // TODO: Navigate to confirmation screen when it exists
        router.back();
      } finally {
        setIsSubmitting(false);
      }
    },
    [params.restaurantId, date, time, partySize, tablePreference, router],
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.headerBtn}
          >
            <MaterialIcons
              name="chevron-left"
              size={wp(7)}
              color={Colors.white}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Reserve a table</Text>
          <Pressable
            onPress={() => router.push("/(tabs)/cart")}
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            style={styles.headerBtn}
          >
            <MaterialIcons
              name="shopping-cart"
              size={24}
              color={Colors.white}
            />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
      >
        {/* ── Restaurant info card ── */}
        <View style={styles.restaurantCard}>
          <Image
            source={{ uri: params.restaurantImage }}
            style={styles.restaurantThumb}
            accessibilityLabel={params.restaurantName}
          />
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantNameRow}>
              <Text style={styles.restaurantName} numberOfLines={1}>
                {params.restaurantName}
              </Text>
              <Text style={styles.restaurantPrice}>Rs {price}</Text>
            </View>
            <Text style={styles.restaurantTagline}>
              {params.restaurantTagline}
            </Text>
            <View style={styles.ratingRow}>
              <MaterialIcons
                name="star"
                size={ICON_SM}
                color={Colors.warning}
              />
              <Text style={styles.ratingText}>
                {rating.toFixed(1)} ({reviewCount} reviews) •{" "}
                {params.restaurantCategory}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Reservation details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reservation details</Text>

          <Pressable
            style={styles.dropdownRow}
            onPress={() => setPickerType("date")}
            accessibilityRole="button"
            accessibilityLabel="Select date"
          >
            <MaterialIcons
              name="calendar-today"
              size={ICON_MD}
              color={Colors.gray3}
            />
            <Text style={styles.dropdownLabel}>{formatDisplayDate(date)}</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={ICON_MD}
              color={Colors.gray3}
            />
          </Pressable>

          <Pressable
            style={styles.dropdownRow}
            onPress={() => setPickerType("time")}
            accessibilityRole="button"
            accessibilityLabel="Select time"
          >
            <MaterialIcons
              name="schedule"
              size={ICON_MD}
              color={Colors.gray3}
            />
            <Text style={styles.dropdownLabel}>{formatTime(time)}</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={ICON_MD}
              color={Colors.gray3}
            />
          </Pressable>

          <Pressable
            style={styles.dropdownRow}
            onPress={() => setPickerType("partySize")}
            accessibilityRole="button"
            accessibilityLabel="Select party size"
          >
            <MaterialIcons name="person" size={ICON_MD} color={Colors.gray3} />
            <Text style={styles.dropdownLabel}>{partySize} People</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={ICON_MD}
              color={Colors.gray3}
            />
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* ── Table preference ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select table preference</Text>
          <Text style={styles.sectionSubtitle}>
            We'll do our best to accommodate your preference
          </Text>
          <View style={styles.preferenceRow}>
            {PREFERENCE_OPTIONS.map((opt) => {
              const isSelected = tablePreference === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.preferenceCard,
                    isSelected && styles.preferenceCardSelected,
                  ]}
                  onPress={() => setTablePreference(opt.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`${opt.label} seating`}
                >
                  {isSelected && (
                    <View style={styles.preferenceCheck}>
                      <MaterialIcons
                        name="check-circle"
                        size={ICON_SM}
                        color={Colors.primary}
                      />
                    </View>
                  )}
                  <MaterialIcons
                    name={
                      opt.value === "indoor"
                        ? "home"
                        : opt.value === "outdoor"
                          ? "wb-sunny"
                          : "people"
                    }
                    size={wp(8)}
                    color={isSelected ? Colors.primary : Colors.gray3}
                  />
                  <Text
                    style={[
                      styles.preferenceLabel,
                      isSelected && styles.preferenceLabelSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Special requests ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special requests (optional)</Text>
          <View style={styles.textAreaWrapper}>
            <Controller
              control={control}
              name="specialRequests"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.textArea}
                  placeholder="E.g. Birthday celebration, High chair, Window seat"
                  placeholderTextColor={Colors.gray3}
                  multiline
                  maxLength={120}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  accessibilityLabel="Special requests, optional"
                  textAlignVertical="top"
                />
              )}
            />
            <Text style={styles.charCount}>
              {(specialRequests ?? "").length}/120
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Your details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your details</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputRow}>
                <MaterialIcons
                  name="person"
                  size={ICON_MD}
                  color={Colors.gray3}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.gray3}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  accessibilityLabel="Enter your name"
                />
              </View>
            )}
          />
          {errors.name && (
            <Text style={styles.errorText} accessibilityLiveRegion="polite">
              {errors.name.message}
            </Text>
          )}

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputRow, styles.inputRowTop]}>
                <MaterialIcons
                  name="phone"
                  size={ICON_MD}
                  color={Colors.gray3}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={Colors.gray3}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  accessibilityLabel="Enter your phone number"
                />
              </View>
            )}
          />
          {errors.phone && (
            <Text style={styles.errorText} accessibilityLiveRegion="polite">
              {errors.phone.message}
            </Text>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputRow, styles.inputRowTop]}>
                <MaterialIcons
                  name="email"
                  size={ICON_MD}
                  color={Colors.gray3}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.gray3}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityLabel="Enter your email"
                />
              </View>
            )}
          />
          {errors.email && (
            <Text style={styles.errorText} accessibilityLiveRegion="polite">
              {errors.email.message}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* ── Total ── */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>Rs {price}</Text>
        </View>
      </ScrollView>

      {/* ── Bottom actions ── */}
      <View
        style={[
          styles.actionBar,
          { paddingBottom: insets.bottom || Spacing.reg },
        ]}
      >
        <Pressable
          style={[
            styles.confirmBtn,
            (!isValid || isSubmitting) && styles.confirmBtnDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Confirm reservation"
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm reservation</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
          onPress={() => setIsSaved((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel="Save for later"
        >
          <MaterialIcons
            name={isSaved ? "favorite" : "favorite-border"}
            size={ICON_MD}
            color={isSaved ? Colors.white : Colors.primary}
          />
          <Text
            style={[styles.saveBtnText, isSaved && styles.saveBtnTextActive]}
          >
            Save for later
          </Text>
        </Pressable>
      </View>

      <ReservationPickers
        pickerType={pickerType}
        onClose={() => setPickerType(null)}
        date={date}
        onDateChange={setDate}
        time={time}
        onTimeChange={setTime}
        partySize={partySize}
        onPartySizeChange={setPartySize}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header
  header: {
    backgroundColor: Colors.primary,
  },
  headerInner: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
  },
  headerBtn: {
    padding: Spacing.xs,
    position: "relative",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    color: Colors.primary,
    fontSize: FontSizes.xs - 2,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray5,
  },
  // Restaurant info card
  restaurantCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.reg,
    gap: Spacing.md,
    backgroundColor: Colors.white,
  },
  restaurantThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.gray5,
  },
  restaurantInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  restaurantNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  restaurantName: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black1,
    flex: 1,
    marginRight: Spacing.sm,
  },
  restaurantPrice: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  restaurantTagline: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
  },
  // Section
  section: {
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black1,
  },
  sectionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
    marginTop: -Spacing.sm,
  },
  // Dropdown rows
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  dropdownLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.black1,
  },
  // Table preference
  preferenceRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  preferenceCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 8,
    backgroundColor: Colors.white,
    gap: Spacing.xs,
    position: "relative",
  },
  preferenceCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  preferenceCheck: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
  },
  preferenceLabel: {
    fontSize: FontSizes.xs,
    color: Colors.gray2,
    fontWeight: "600",
  },
  preferenceLabelSelected: {
    color: Colors.primary,
  },
  // Special requests
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  textArea: {
    fontSize: FontSizes.sm,
    color: Colors.black1,
    padding: Spacing.md,
    minHeight: hp(10),
  },
  charCount: {
    fontSize: FontSizes.xs,
    color: Colors.gray3,
    textAlign: "right",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  // Your details inputs
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  inputRowTop: {
    marginTop: -Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.black1,
    paddingVertical: Spacing.xs,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: -Spacing.sm,
  },
  // Total
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black1,
  },
  totalAmount: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.primary,
  },
  // Action bar
  actionBar: {
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
    gap: Spacing.sm,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.primaryDisabled,
  },
  confirmBtnText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  saveBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  saveBtnText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
  saveBtnTextActive: {
    color: Colors.white,
  },
});

export default ReserveTable;
