import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ButtonProps {
  text: string;
  type?: "primary" | "secondary";
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  text,
  type = "primary",
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  const pressed = useSharedValue(0);

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
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.base,
          type === "primary" ? styles.primary : styles.secondary,
          animatedStyle,
          style,
        ]}
      >
        <Text style={[styles.text, textStyle]}>{text}</Text>
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
    margin: 5,
  },
  primary: {
    backgroundColor: "#003cff",
  },
  secondary: {
    backgroundColor: "#60a5fa",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
