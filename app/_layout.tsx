import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for demo purposes to show the splash screen
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    if (loaded) {
      prepare();
    }
  }, [loaded]);

  useEffect(() => {
    if (appIsReady && loaded) {
      // Hide the native splash screen
      SplashScreen.hideAsync();
    }
  }, [appIsReady, loaded]);

  if (!appIsReady || !loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="splash">
       
        <Stack.Screen name="splash" options={{ headerShown: false }} />

        {/* <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} /> */}

        {/* Main App with Sidebar Layout */}
        <Stack.Screen
          name="(sidebar)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <Toast /> 
    </ThemeProvider>
  );
}
