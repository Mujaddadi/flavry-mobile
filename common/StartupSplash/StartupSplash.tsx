import { useEffect, useRef } from "react";
import { Animated, ImageBackground, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const SPLASH_ART = require("assets/images/flavry-splash.jpg");

const StartupSplash = () => {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={styles.root} accessibilityLabel="Flavry is loading">
      <StatusBar style="dark" />
      <ImageBackground
        source={SPLASH_ART}
        resizeMode="cover"
        style={styles.artwork}
      >
        <Animated.View style={[styles.loadingGlow, { opacity: pulse }]} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: "#FFFBF4",
  },
  artwork: {
    flex: 1,
  },
  loadingGlow: {
    position: "absolute",
    top: "54.6%",
    alignSelf: "center",
    width: 36,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 110, 0, 0.3)",
  },
});

export default StartupSplash;
