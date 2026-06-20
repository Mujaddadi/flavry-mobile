import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Colors, Spacing } from "assets/styles/theme";
import { wp } from "utils/dimensions";

interface SkeletonCardProps {
  width?: number;
  height?: number;
}

const SkeletonCard = ({ width = wp(75), height = 220 }: SkeletonCardProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 800 }), -1, true);
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[styles.card, { width, height }, animStyle]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.imagePlaceholder} />
      <View style={styles.body}>
        <View style={styles.titleLine} />
        <View style={styles.subtitleLine} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: Colors.borderColor,
    overflow: "hidden",
    marginRight: Spacing.md,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: Colors.gray5,
  },
  body: {
    padding: 10,
    gap: 6,
  },
  titleLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray4,
    width: "70%",
  },
  subtitleLine: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gray5,
    width: "50%",
  },
});

export default SkeletonCard;
