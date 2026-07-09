import dayjs from "dayjs";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import {
  formatPickerDate,
  formatTime,
  makeDates,
  TIME_PICKER_SLOTS,
} from "utils/reservationUtils";
import { wp } from "utils/dimensions";

const ICON_MD = wp(4.5);

const DATES = makeDates();

interface Props {
  pickerType: "date" | "time" | "partySize" | null;
  onClose: () => void;
  date: string;
  onDateChange: (date: string) => void;
  time: string;
  onTimeChange: (time: string) => void;
  partySize: number;
  onPartySizeChange: (size: number) => void;
}

const ReservationPickers = ({
  pickerType,
  onClose,
  date,
  onDateChange,
  time,
  onTimeChange,
  partySize,
  onPartySizeChange,
}: Props) => (
  <>
    {/* Date picker */}
    <Modal
      visible={pickerType === "date"}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close date picker"
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>Select date</Text>
          <ScrollView>
            {DATES.map((d, i) => {
              const isSelected = d.isSame(dayjs(date), "day");
              const label = formatPickerDate(d, i);
              return (
                <Pressable
                  key={i}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => {
                    onDateChange(d.toISOString());
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                >
                  <Text
                    style={[
                      styles.rowText,
                      isSelected && styles.rowTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                  {isSelected && (
                    <MaterialIcons
                      name="check"
                      size={ICON_MD}
                      color={Colors.primary}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>

    {/* Time picker */}
    <Modal
      visible={pickerType === "time"}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close time picker"
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>Select time</Text>
          <ScrollView>
            {TIME_PICKER_SLOTS.map((slot) => {
              const isSelected = slot === time;
              return (
                <Pressable
                  key={slot}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => {
                    onTimeChange(slot);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={formatTime(slot)}
                >
                  <Text
                    style={[
                      styles.rowText,
                      isSelected && styles.rowTextSelected,
                    ]}
                  >
                    {formatTime(slot)}
                  </Text>
                  {isSelected && (
                    <MaterialIcons
                      name="check"
                      size={ICON_MD}
                      color={Colors.primary}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>

    {/* Party size picker */}
    <Modal
      visible={pickerType === "partySize"}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close party size picker"
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>Party size</Text>
          <View style={styles.stepperRow}>
            <Pressable
              style={[
                styles.stepperBtn,
                partySize <= 1 && styles.stepperBtnDisabled,
              ]}
              onPress={() => onPartySizeChange(Math.max(1, partySize - 1))}
              disabled={partySize <= 1}
              accessibilityRole="button"
              accessibilityLabel="Decrease party size"
            >
              <Text style={styles.stepperBtnText}>−</Text>
            </Pressable>
            <Text style={styles.stepperCount}>{partySize} People</Text>
            <Pressable
              style={[
                styles.stepperBtn,
                partySize >= 20 && styles.stepperBtnDisabled,
              ]}
              onPress={() => onPartySizeChange(Math.min(20, partySize + 1))}
              disabled={partySize >= 20}
              accessibilityRole="button"
              accessibilityLabel="Increase party size"
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.doneBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Done"
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  </>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(130,130,130,0.7)",
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.reg,
    maxHeight: "60%",
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: "700",
    color: Colors.black1,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray5,
  },
  rowSelected: {
    backgroundColor: Colors.primaryLight,
  },
  rowText: {
    fontSize: FontSizes.sm,
    color: Colors.black1,
  },
  rowTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.gray4,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperBtnText: {
    fontSize: FontSizes.xl,
    color: Colors.black2,
  },
  stepperCount: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.black1,
    minWidth: wp(30),
    textAlign: "center",
  },
  doneBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  doneBtnText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
});

export default ReservationPickers;
