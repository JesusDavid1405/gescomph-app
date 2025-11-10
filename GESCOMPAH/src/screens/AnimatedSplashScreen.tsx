import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

export default function AnimatedSplashScreen({ onFinish }: { onFinish: () => void }) {
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de color: de negro → amarillo → negro
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Después de unos segundos, pasa a la app principal
    const timeout = setTimeout(onFinish, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000000", "#F2C94C"], // negro → amarillo
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { color: textColor }]}>
        GESCOMPH
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#418a2fff", // fondo verde del sistema
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
