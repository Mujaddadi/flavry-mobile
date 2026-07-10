import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import FieldCard from "./components/FieldCard";

// TODO: Replace with real auth store data when auth is implemented
const MOCK_USER = {
  name: "Taha Hassan Mujaddadi",
  email: "tahahassan82@gmail.com",
  address: "Nuijavuori 2 G 45, Espoo",
};

const ProfileDetail = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fieldValues, setFieldValues] = useState({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    address: MOCK_USER.address,
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");

  const startEditing = (field: string) => {
    setDraftValue(fieldValues[field as keyof typeof fieldValues]);
    setEditingField(field);
  };

  const saveField = () => {
    if (!editingField) return;
    setFieldValues((prev) => ({ ...prev, [editingField]: draftValue }));
    setEditingField(null);
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: call delete account API, clear auth store, navigate to login
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.navigate("/(tabs)/profile")}
          accessibilityRole="button"
          accessibilityLabel="Go back to profile"
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        <Text style={styles.subtitle}>
          Manage your personal information{"\n"}and account settings.
        </Text>

        <View style={styles.fields}>
          <FieldCard
            label="Name"
            icon="person"
            displayValue={fieldValues.name}
            draftValue={editingField === "name" ? draftValue : fieldValues.name}
            isEditing={editingField === "name"}
            onPressEdit={() => startEditing("name")}
            onChangeDraft={setDraftValue}
            onSave={saveField}
          />
          <FieldCard
            label="Email"
            icon="email"
            displayValue={fieldValues.email}
            draftValue={
              editingField === "email" ? draftValue : fieldValues.email
            }
            isEditing={editingField === "email"}
            onPressEdit={() => startEditing("email")}
            onChangeDraft={setDraftValue}
            onSave={saveField}
            keyboardType="email-address"
          />
          <FieldCard
            label="Address"
            icon="place"
            displayValue={fieldValues.address}
            draftValue={
              editingField === "address" ? draftValue : fieldValues.address
            }
            isEditing={editingField === "address"}
            onPressEdit={() => startEditing("address")}
            onChangeDraft={setDraftValue}
            onSave={saveField}
          />
          <FieldCard
            label="Change your Password"
            icon="lock"
            displayValue="Update Password"
            draftValue=""
            isEditing={false}
            onPressEdit={() => {
              // TODO: navigate to change password screen when implemented
            }}
            onChangeDraft={() => {}}
            onSave={() => {}}
          />
        </View>

        <Pressable
          style={styles.deleteButton}
          onPress={handleDeleteProfile}
          accessibilityRole="button"
          accessibilityLabel="Delete profile"
        >
          <MaterialIcons name="delete" size={20} color={Colors.error} />
          <Text style={styles.deleteText}>Delete Profile</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  subtitle: {
    color: Colors.gray2,
    fontSize: FontSizes.sm,
    lineHeight: 22,
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  fields: {
    paddingHorizontal: Spacing.reg,
    gap: Spacing.md,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.reg,
    marginTop: Spacing.xxxl,
    paddingVertical: Spacing.reg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deleteText: {
    color: Colors.error,
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
});

export default ProfileDetail;
