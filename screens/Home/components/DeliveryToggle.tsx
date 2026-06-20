import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "assets/styles/theme";
import { useHomeStore } from "store/homeStore";
import { DeliveryMode } from "types/home";
import { wp } from "utils/dimensions";

const TRACK_WIDTH = wp(15);
const TRACK_HEIGHT = wp(7.5);
const THUMB_SIZE = wp(5.9);
const THUMB_PADDING = wp(0.8);
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING * 2;

const DeliveryToggle = () => {
  const { deliveryMode, setDeliveryMode } = useHomeStore();
  const isDelivery = deliveryMode === DeliveryMode.DELIVERY;
  const progress = useSharedValue(isDelivery ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDelivery ? 1 : 0, { duration: 250 });
  }, [isDelivery, progress]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  const trackColor = isDelivery ? Colors.primary : Colors.primaryLight;

  const toggle = () =>
    setDeliveryMode(isDelivery ? DeliveryMode.PICKUP : DeliveryMode.DELIVERY);

  return (
    <Pressable
      onPress={toggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="switch"
      accessibilityLabel={
        isDelivery ? "Switch to pickup" : "Switch to delivery"
      }
      accessibilityState={{ checked: isDelivery }}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <MaterialIcons
            name={isDelivery ? "delivery-dining" : "home"}
            size={14}
            color={isDelivery ? Colors.primary : Colors.gray3}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: "center",
    paddingHorizontal: THUMB_PADDING,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default DeliveryToggle;
