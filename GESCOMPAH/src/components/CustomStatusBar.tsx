import React, { useEffect } from "react";
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
  useEffect(() => {
    StatusBar.setBarStyle(barStyle);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(backgroundColor);
      StatusBar.setTranslucent(true); 
    }
  }, [backgroundColor, barStyle]);

  return (
    <View style={{
      backgroundColor,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <SafeAreaView style={{ backgroundColor }}>
        <StatusBar
          translucent={Platform.OS === "android"}
          backgroundColor={Platform.OS === "android" ? backgroundColor : "transparent"}
          barStyle={barStyle}
        />
      </SafeAreaView>
    </View>
  );
}
