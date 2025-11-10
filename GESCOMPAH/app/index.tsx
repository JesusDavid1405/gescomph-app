import RootNavigator from "@/src/navigation/RootNavigator";
import AnimatedSplashScreen from "@/src/screens/AnimatedSplashScreen";
import { AuthProvider } from "@/src/context/AuthContext";
import React, { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
