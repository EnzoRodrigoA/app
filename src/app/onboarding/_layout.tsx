import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Slot } from "expo-router";
import { View } from "react-native";

export default function OnboardingLayout() {
  const { theme } = useTheme();

  return (
    <OnboardingProvider>
      <View
        style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
      >
        <Slot />
      </View>
    </OnboardingProvider>
  );
}
