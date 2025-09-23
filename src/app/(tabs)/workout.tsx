import { AnimatedIcon } from "@/components/animated-icon";
import ApiStatus from "@/components/api-status";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedOverlayCard } from "@/components/themed-overlay-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<AnimatedIcon emoji="🔥" size={120} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Treinos
        </ThemedText>
      </ThemedView>
      <ThemedText>Aqui você pode ver seus treinos</ThemedText>
      <ThemedOverlayCard>
        <ApiStatus />
      </ThemedOverlayCard>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
