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
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
            name="workout"
            options={{ headerShown: false, animation: "slide_from_left" }}
          />
          <Stack.Screen
            name="workout-exercises/[id]"
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
  const [fontsLoaded] = Font.useFonts({
    RobotoRegular: require("@/assets/fonts/Roboto/Roboto-Regular.ttf"),
    RobotoMedium: require("@/assets/fonts/Roboto/Roboto-Medium.ttf"),
    RobotoLight: require("@/assets/fonts/Roboto/Roboto-Light.ttf"),
    TekoSemiBold: require("@/assets/fonts/Teko/Teko-SemiBold.ttf"),
    TekoMedium: require("@/assets/fonts/Teko/Teko-Medium.ttf"),
    TekoRegular: require("@/assets/fonts/Teko/Teko-Regular.ttf"),
    TekoBold: require("@/assets/fonts/Teko/Teko-Bold.ttf"),
  });
  if (!fontsLoaded) return null;
  const customMapping = {
    strict: {
      "text-font-family": "RobotoRegular",

      "heading-1-font-family": "MegrimRegular",
      "heading-2-font-family": "MegrimRegular",
      "heading-3-font-family": "MegrimRegular",
      "heading-4-font-family": "MegrimRegular",

      "subtitle-1-font-family": "RobotoMedium",
      "subtitle-2-font-family": "RobotoRegular",

      "label-font-family": "RobotoMedium",
      "caption-1-font-family": "RobotoRegular",
      "caption-2-font-family": "RobotoLight",
    },
    components: {},
  };
  return (
    <GestureHandlerRootView>
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
    </GestureHandlerRootView>
  );
}
