import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
  type PressableProps,
} from "react-native";
import { useThemeColor } from "../hooks/use-theme-color";

export type ThemedPressableProps = PressableProps & {
  title: any;
  lightColor?: string;
  darkColor?: string;
  textColorLight?: string;
  textColorDark?: string;
};

export function ThemedPressable({
  title,
  lightColor,
  darkColor,
  textColorLight,
  textColorDark,
  style,
  ...otherProps
}: ThemedPressableProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary"
  );

  const textColor = useThemeColor(
    { light: textColorLight ?? "#fff", dark: textColorDark ?? "#fff" },
    "text"
  );

  return (
    <Pressable
      {...otherProps}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: pressed ? 0.7 : 1 },
        style as StyleProp<ViewStyle>,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
});
