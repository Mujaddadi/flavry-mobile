import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import StartupSplash from "common/StartupSplash";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function Layout() {
  const [showStartupSplash, setShowStartupSplash] = useState(true);

  useEffect(() => {
    void SplashScreen.hideAsync();
    const timer = setTimeout(() => setShowStartupSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        {showStartupSplash && <StartupSplash />}
      </>
    </QueryClientProvider>
  );
}
