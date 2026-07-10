import MaterialIcons, {
  MaterialIconsIconName,
} from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";

const SOFT_ORANGE = "#FFF2EC";
const ICON_CIRCLE_SIZE = 44;

// TODO: Replace with real auth store data when auth is implemented
const MOCK_USER = {
  name: "Taha Hassan Mujaddadi",
  email: "tahahassan82@gmail.com",
  address: "Nuijavuori 2 G 45, Espoo",
};

interface FieldCardProps {
  label: string;
  icon: MaterialIconsIconName;
  displayValue: string;
  draftValue: string;
  isEditing: boolean;
  onPressEdit: () => void;
  onChangeDraft: (text: string) => void;
  onSave: () => void;
  keyboardType?: KeyboardTypeOptions;
}

const FieldCard = ({
  label,
  icon,
  displayValue,
  draftValue,
  isEditing,
  onPressEdit,
  onChangeDraft,
  onSave,
  keyboardType = "default",
}: FieldCardProps) => (
  <View style={styles.card}>
    <View style={styles.iconCircle}>
      <MaterialIcons name={icon} size={20} color={Colors.primary} />
    </View>
    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.fieldInput}
          value={draftValue}
          onChangeText={onChangeDraft}
          autoFocus
          keyboardType={keyboardType}
          returnKeyType="done"
          onSubmitEditing={onSave}
          accessibilityLabel={`Edit ${label}`}
        />
      ) : (
        <Text style={styles.fieldValue}>{displayValue}</Text>
      )}
    </View>
    <Pressable
      style={styles.actionButton}
      onPress={isEditing ? onSave : onPressEdit}
      accessibilityRole="button"
      accessibilityLabel={isEditing ? `Save ${label}` : `Edit ${label}`}
    >
      <MaterialIcons
        name={isEditing ? "check" : "edit"}
        size={20}
        color={Colors.primary}
      />
    </Pressable>
  </View>
);

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

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    elevation: 1,
    shadowColor: Colors.black1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    backgroundColor: SOFT_ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    color: Colors.gray3,
    fontSize: FontSizes.xs,
    marginBottom: Spacing.xs,
  },
  fieldValue: {
    color: Colors.black2,
    fontSize: FontSizes.md,
  },
  fieldInput: {
    color: Colors.black2,
    fontSize: FontSizes.md,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  actionButton: {
    padding: Spacing.xs,
  },
});

export default ProfileDetail;
