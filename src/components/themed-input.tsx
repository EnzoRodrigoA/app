import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { useThemeColor } from "../hooks/use-theme-color";

export type ThemedInputProps = TextInputProps & {
  label?: string;
  error?: string;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedInput({
  lightColor,
  darkColor,
  label,
  error,
  style,
  ...otherProps
}: ThemedInputProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const textColor = useThemeColor(
    {
      light: "#000",
      dark: "#fff",
    },
    "text"
  );
  const borderColor = useThemeColor(
    {
      light: "#ccc",
      dark: "#555",
    },
    "border"
  );

  return (
    <View style={{ marginVertical: 8 }}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}> {label}</Text>
      )}
      <TextInput
        {...otherProps}
        style={[
          styles.input,
          { backgroundColor, color: textColor, borderColor },
          style,
        ]}
      />
      {error && (
        <Text style={[styles.error, { color: "#FF6B6B" }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: "500",
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});
