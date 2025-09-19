import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useThemeColor } from "../hooks/use-theme-color";

type AnimationType = "rotate" | "scale" | "bounce";

type AnimatedIconProps = {
  emoji?: string;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  repeat?: number;
  animationType?: AnimationType;
  delay?: number;
  rotateDeg?: number;
  scaleTo?: number;
};

export function AnimatedIcon({
  emoji,
  iconName,
  size = 28,
  repeat = 4,
  animationType = "rotate",
  delay = 0,
  rotateDeg = 10,
  scaleTo = 0.2,
}: AnimatedIconProps) {
  const animationValue = useSharedValue(0);
  const color = useThemeColor({ light: "#00b7ff", dark: "#fefefe" }, "text");

  React.useEffect(() => {
    animationValue.value = withDelay(
      delay,
      withRepeat(
        withTiming(animationType === "rotate" ? rotateDeg : scaleTo, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }),
        repeat,
        true
      )
    );
  }, [animationValue, animationType, delay, repeat, rotateDeg, scaleTo]);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case "rotate":
        return { transform: [{ rotate: `${animationValue.value}deg` }] };
      case "scale":
        return { transform: [{ scale: animationValue.value + 1 }] };
      case "bounce":
        return {
          transform: [{ scale: 1 + Math.sin(animationValue.value) * 0.3 }],
        };
      default:
        return {};
    }
  });

  const content = emoji ? (
    <Text style={{ fontSize: size }}>{emoji}</Text>
  ) : (
    <Ionicons name={iconName!} color={color} />
  );

  return <Animated.View style={animatedStyle}>{content}</Animated.View>;
}
