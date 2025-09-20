import * as React from "react";

import { StyleSheet } from "react-native";
import { useThemeColor } from "../hooks/use-theme-color";
import { ThemedView } from "./themed-view";

type Props = React.ComponentProps<typeof ThemedView>;

export function ThemedOverlayCard({ style, ...rest }: Props) {
  const cardColors = useThemeColor(
    {
      light: "#ffffff",
      dark: "#1e1e1e",
    },
    "background"
  );
  return (
    <ThemedView
      style={[styles.card, style, { backgroundColor: cardColors }]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
});
