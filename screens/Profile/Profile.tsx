import Constants from "expo-constants";
import MaterialIcons, {
  MaterialIconsIconName,
} from "@react-native-vector-icons/material-icons";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { wp } from "utils/dimensions";

const SOFT_ORANGE = "#FFF2EC";
const AVATAR_SIZE = wp(18);
const AVATAR_ICON_SIZE = wp(14);
const EDIT_BTN_SIZE = 24;

interface MenuItem {
  label: string;
  icon: MaterialIconsIconName;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Profile", icon: "account-circle" },
  { label: "Chat Now", icon: "chat" },
  { label: "FAQ", icon: "help" },
  { label: "Privacy Policy", icon: "security" },
  { label: "Terms & Conditions", icon: "description" },
  { label: "Refund Policy", icon: "currency-exchange" },
  { label: "Contact Us", icon: "phone" },
  { label: "Logout", icon: "exit-to-app" },
];

// TODO: Replace with real auth store data when auth is implemented
const MOCK_USER = {
  name: "Taha Hassan Mujaddadi",
  email: "tahahassan82@gmail.com",
};

const Profile = () => {
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version ?? "—";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // TODO: clear auth store and navigate to login when auth is implemented
        },
      },
    ]);
  };

  const handleMenuPress = (label: string) => {
    if (label === "Logout") {
      handleLogout();
      return;
    }
    // TODO: navigate to respective screens when implemented
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        {/* Orange header with title + user card */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Profile</Text>
            <Pressable
              style={styles.bellButton}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <MaterialIcons
                name="notifications"
                size={26}
                color={Colors.white}
              />
            </Pressable>
          </View>

          {/* User identity card */}
          <View style={styles.userCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <MaterialIcons
                  name="account-circle"
                  size={AVATAR_ICON_SIZE}
                  color={Colors.primary}
                />
              </View>
              <Pressable
                style={styles.editButton}
                accessibilityRole="button"
                accessibilityLabel="Edit profile picture"
              >
                <MaterialIcons name="edit" size={12} color={Colors.white} />
              </Pressable>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={2}>
                {MOCK_USER.name}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {MOCK_USER.email}
              </Text>
            </View>
          </View>
        </View>

        {/* General section */}
        <View style={styles.generalCard}>
          <Text style={styles.sectionTitle}>General</Text>
          {MENU_ITEMS.map((item, index) => (
            <View key={item.label}>
              <Pressable
                style={styles.menuRow}
                onPress={() => handleMenuPress(item.label)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <View style={styles.iconBubble}>
                  <MaterialIcons
                    name={item.icon}
                    size={22}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={Colors.gray3}
                />
              </Pressable>
              {index < MENU_ITEMS.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>

        {/* Version footer */}
        <View
          style={styles.versionRow}
          accessibilityLabel={`App version ${version}`}
        >
          <MaterialIcons name="info" size={18} color={Colors.primary} />
          <Text style={styles.versionText}>Version: {version}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.reg,
    paddingBottom: Spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.reg,
  },
  title: {
    color: Colors.white,
    fontSize: FontSizes.xxxl,
    fontWeight: "700",
  },
  bellButton: {
    padding: Spacing.xs,
  },
  userCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.reg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.reg,
    elevation: 4,
    shadowColor: Colors.black1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: SOFT_ORANGE,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: EDIT_BTN_SIZE,
    height: EDIT_BTN_SIZE,
    borderRadius: EDIT_BTN_SIZE / 2,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: Colors.black1,
    fontSize: FontSizes.xl,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  userEmail: {
    color: Colors.gray2,
    fontSize: FontSizes.sm,
  },
  generalCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: Spacing.reg,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.reg,
    paddingBottom: Spacing.xs,
    elevation: 2,
    shadowColor: Colors.black1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sectionTitle: {
    color: Colors.black1,
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.reg,
    gap: Spacing.reg,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: SOFT_ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    color: Colors.black1,
    fontSize: FontSizes.md,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray5,
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
  },
  versionText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
  },
});

export default Profile;
