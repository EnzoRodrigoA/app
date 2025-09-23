import themeDark from "@/theme/theme-dark.json";
import themeLight from "@/theme/theme-light.json";
import * as eva from "@eva-design/eva";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useColorScheme } from "../hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function LayoutWithAuth() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, hasCompletedOnboarding, loading } = useAuth();

  if (loading) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn && !hasCompletedOnboarding}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn && hasCompletedOnboarding}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="user-profile"
            options={{ headerShown: false, animation: "slide_from_left" }}
          />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    OswaldRegular: require("@/assets/fonts/Oswald/Oswald-Regular.ttf"),
    OswaldBold: require("@/assets/fonts/Oswald/Oswald-Bold.ttf"),
  });
  if (!fontsLoaded) return null;
  const customMapping = {
    ...eva.mapping,
    "text-font-family": "OswaldRegular",
    "heading-font-family": "OswaldBold",
  };
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{
          ...(colorScheme === "dark" ? eva.dark : eva.light),
          ...(colorScheme === "dark" ? themeDark : themeLight),
        }}
        customMapping={customMapping}
      >
        <AuthProvider>
          <LayoutWithAuth />
        </AuthProvider>
      </ApplicationProvider>
    </>
  );
}
