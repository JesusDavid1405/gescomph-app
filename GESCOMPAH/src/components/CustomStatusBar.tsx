import React from "react";
import { StatusBar, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomStatusBarProps {
  backgroundColor?: string;
  barStyle?: "light-content" | "dark-content";
}

export default function CustomStatusBar({
  backgroundColor = "#418a2fff",
  barStyle = "dark-content",
}: CustomStatusBarProps) {
  return (
    <View style={{ backgroundColor }}>
      <SafeAreaView style={{ backgroundColor }}>
        <StatusBar
          translucent={Platform.OS === "android"}
          backgroundColor={backgroundColor}
          barStyle={barStyle}
        />
      </SafeAreaView>
    </View>
  );
}
