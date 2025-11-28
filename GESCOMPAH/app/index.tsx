import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from "@/src/navigation/RootNavigator";
import AnimatedSplashScreen from "@/src/screens/AnimatedSplashScreen";
import { AuthProvider } from "@/src/context/AuthContext";
import { SearchProvider } from "@/src/context/SearchContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import CustomStatusBar from "@/src/components/CustomStatusBar";
import React, { useState } from "react";

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <CustomStatusBar backgroundColor="#539741ff" barStyle="dark-content" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
