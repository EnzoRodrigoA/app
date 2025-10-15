import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInRight, FadeOutRight } from "react-native-reanimated";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: string;
  position?: "bottom" | "top";
  loading?: boolean;
  color?: string;
  disabled?: boolean;
}

export const FloatingActionButton = ({
  onPress,
  icon,
  position = "bottom",
  loading = false,
  color,
  disabled = false,
}: FloatingActionButtonProps) => {
  const theme = useTheme();

  const buttonColor = color || theme.theme.colors.primary[500];

  return (
    <Animated.View
      entering={FadeInRight.duration(300)}
      exiting={FadeOutRight.duration(300)}
      style={[
        styles.container,
        position === "bottom" ? styles.bottomPosition : styles.topPosition,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          { backgroundColor: buttonColor },
          disabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Ionicons name={icon as any} size={24} color="white" />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    zIndex: 10,
  },
  bottomPosition: {
    bottom: 30,
  },
  topPosition: {
    bottom: 100,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
