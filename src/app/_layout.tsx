import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider
} from "@react-navigation/native"
import * as Font from "expo-font"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import "react-native-reanimated"
import { AuthProvider, useAuth } from "../contexts/AuthContext"
import { ThemeProvider } from "../contexts/ThemeContext"
import { useColorScheme } from "../hooks/use-color-scheme"

export const unstable_settings = {
  anchor: "(tabs)"
}

function LayoutWithAuth() {
  const colorScheme = useColorScheme()
  const { isLoggedIn, hasCompletedOnboarding, loading } = useAuth()

  if (loading) return null

  return (
    <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
            name="workout-exercises/[id]"
            options={{ headerShown: false, animation: "slide_from_left" }}
          />
          <Stack.Screen
            name="workout/[id]"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = Font.useFonts({
    RobotoRegular: require("@/assets/fonts/Roboto/Roboto-Regular.ttf"),
    RobotoMedium: require("@/assets/fonts/Roboto/Roboto-Medium.ttf"),
    RobotoLight: require("@/assets/fonts/Roboto/Roboto-Light.ttf"),
    TekoSemiBold: require("@/assets/fonts/Teko/Teko-SemiBold.ttf"),
    TekoMedium: require("@/assets/fonts/Teko/Teko-Medium.ttf"),
    TekoRegular: require("@/assets/fonts/Teko/Teko-Regular.ttf"),
    TekoBold: require("@/assets/fonts/Teko/Teko-Bold.ttf")
  })

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <LayoutWithAuth />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
