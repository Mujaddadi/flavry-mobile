import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { RestaurantDetail } from "types/home";
import { wp } from "utils/dimensions";

const SECTION_ICON = wp(5);

// TODO: Replace with a URL derived from real restaurant coordinates when backend is ready.
const PLACEHOLDER_MAP_URI =
  "https://staticmap.openstreetmap.de/staticmap.php?center=60.2055,24.6559&zoom=14&size=600x200&maptype=osm-mapnik&markers=60.2055,24.6559,red-pushpin";

interface Props {
  restaurant: RestaurantDetail;
  visible: boolean;
  onClose: () => void;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const SectionHeading = ({ icon, title }: { icon: string; title: string }) => (
  <View style={styles.sectionHeading}>
    <MaterialIcons name={icon} size={SECTION_ICON} color={Colors.primary} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const RestaurantDetailSheet = ({ restaurant, visible, onClose }: Props) => {
  const handleShare = async () => {
    await Share.share({ message: `Check out ${restaurant.name} on Flavry!` });
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent(
      `${restaurant.address} ${restaurant.city ?? ""}`.trim(),
    );
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close restaurant details"
        />
        <View style={styles.sheet}>
          {/* Name + Share */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Pressable
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share this restaurant"
            >
              <MaterialIcons
                name="share"
                size={SECTION_ICON}
                color={Colors.gray3}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Address + Distance */}
            <View style={styles.addressRow}>
              <View>
                <Text style={styles.addressText}>{restaurant.address}</Text>
                {restaurant.city ? (
                  <Text style={styles.addressText}>{restaurant.city}</Text>
                ) : null}
              </View>
              <Text style={styles.distanceText}>
                {restaurant.distanceKm} km away
              </Text>
            </View>

            {/* Map */}
            <Image
              source={{ uri: PLACEHOLDER_MAP_URI }}
              style={styles.mapImage}
              accessibilityLabel="Restaurant location on map"
            />
            <Pressable
              onPress={handleOpenMap}
              accessibilityRole="link"
              accessibilityLabel="Open restaurant location in maps"
            >
              <Text style={styles.openMapLink}>Open the map</Text>
            </Pressable>

            {/* Delivery Information */}
            <SectionHeading
              icon="delivery-dining"
              title="Delivery information"
            />
            <InfoRow
              label="Delivery time"
              value={`${restaurant.deliveryMinMinutes} - ${restaurant.deliveryMaxMinutes} minutes estimated`}
            />
            <InfoRow
              label="Delivery charges"
              value={`Rs.${restaurant.deliveryFee}`}
            />
            <InfoRow
              label="Minimum Order"
              value={`Rs.${restaurant.minimumOrder}`}
            />

            {/* Opening Hours */}
            {restaurant.openingHours && restaurant.openingHours.length > 0 ? (
              <>
                <SectionHeading icon="calendar-today" title="Opening hours" />
                {restaurant.openingHours.map(({ day, hours }) => (
                  <InfoRow key={day} label={day} value={hours} />
                ))}
              </>
            ) : null}

            {/* Payment Methods */}
            {restaurant.paymentMethods ? (
              <>
                <SectionHeading icon="credit-card" title="Payment methods" />
                <Text style={styles.bodyText}>{restaurant.paymentMethods}</Text>
              </>
            ) : null}

            {/* Contact Information */}
            {restaurant.contactPhone || restaurant.contactEmail ? (
              <>
                <SectionHeading
                  icon="account-circle"
                  title="Contact information"
                />
                {restaurant.contactPhone ? (
                  <InfoRow
                    label="Phone number"
                    value={restaurant.contactPhone}
                  />
                ) : null}
                {restaurant.contactEmail ? (
                  <InfoRow label="Email" value={restaurant.contactEmail} />
                ) : null}
              </>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: Colors.white,
    maxHeight: "82%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: Spacing.reg,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.reg,
    paddingBottom: Spacing.md,
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.black1,
    flex: 1,
    marginRight: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.reg,
    paddingBottom: Spacing.xxxl,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  addressText: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
  },
  distanceText: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
  },
  mapImage: {
    width: "100%",
    height: wp(45),
    borderRadius: 8,
    backgroundColor: Colors.gray5,
    resizeMode: "cover",
  },
  openMapLink: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    color: Colors.black2,
    textAlign: "right",
    flex: 1,
    marginLeft: Spacing.md,
  },
  bodyText: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
    paddingVertical: Spacing.xs,
  },
});

export default RestaurantDetailSheet;
