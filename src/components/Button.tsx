import { useTheme } from "@ui-kitten/components";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ButtonProps {
  content?: React.ReactNode;
  type?: "primary" | "secondary";
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  content,
  type = "primary",
  onPress,
  onLongPress,
  style,
}: ButtonProps) {
  const pressed = useSharedValue(0);

  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(pressed.value ? 0.96 : 1, { duration: 100 }) },
      { translateY: withTiming(pressed.value ? 3 : 0, { duration: 100 }) },
    ],
    shadowOffset: {
      width: 0,
      height: pressed.value ? 2 : 4,
    },
    shadowOpacity: withTiming(pressed.value ? 0.15 : 0.25, { duration: 100 }),
  }));

  return (
    <Pressable
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      onLongPress={onLongPress}
      delayLongPress={300}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.base,
          type === "primary"
            ? { backgroundColor: theme["color-primary-500"] }
            : { backgroundColor: theme["color-secondary-500"] },
          animatedStyle,
          style,
        ]}
      >
        {content}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
    margin: 5,
  },

  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
