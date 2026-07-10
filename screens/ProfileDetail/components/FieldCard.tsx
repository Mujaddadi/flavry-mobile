import MaterialIcons, {
  MaterialIconsIconName,
} from "@react-native-vector-icons/material-icons";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";

const SOFT_ORANGE = "#FFF2EC";
const ICON_CIRCLE_SIZE = 44;

export interface FieldCardProps {
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

const styles = StyleSheet.create({
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
    fontWeight: "700",
  },
  fieldInput: {
    color: Colors.black2,
    fontSize: FontSizes.md,
    fontWeight: "700",
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  actionButton: {
    padding: Spacing.xs,
  },
});

export default FieldCard;
