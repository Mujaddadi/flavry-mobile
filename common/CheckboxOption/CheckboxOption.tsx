import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { wp } from "utils/dimensions";

const CHECKBOX_SIZE = wp(5);

interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  extraPrice?: number;
}

const CheckboxOption = ({
  label,
  checked,
  onPress,
  extraPrice,
}: CheckboxOptionProps) => (
  <Pressable
    style={styles.row}
    onPress={onPress}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
    accessibilityLabel={label}
  >
    <MaterialIcons
      name={checked ? "check-box" : "check-box-outline-blank"}
      size={CHECKBOX_SIZE}
      color={checked ? Colors.primary : Colors.gray4}
    />
    <Text style={styles.label}>{label}</Text>
    {(extraPrice ?? 0) > 0 && (
      <Text style={styles.price}>+ Rs {extraPrice}</Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 44,
  },
  label: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.gray1,
  },
  price: {
    fontSize: FontSizes.sm,
    color: Colors.gray2,
  },
});

export default CheckboxOption;
