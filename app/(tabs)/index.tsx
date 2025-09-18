import { AnimatedIcon } from "@/components/animated-icon";
import { LineChartComponent } from "@/components/BarChart";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedOverlayCard } from "@/components/themed-overlay-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedOverlayCard style={{ width: "55%" }}>
          <ThemedText type="defaultSemiBold">Treino do dia!</ThemedText>
          <AnimatedIcon emoji="🏋️" animationType="rotate" />
        </ThemedOverlayCard>
        <ThemedOverlayCard style={{ width: "55%" }}>
          <ThemedText type="defaultSemiBold">Ofensiva</ThemedText>
          <AnimatedIcon emoji="🔥" animationType="scale" delay={1000} />
        </ThemedOverlayCard>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedOverlayCard>
          <ThemedText type="subtitle">Dashboard</ThemedText>
          <LineChartComponent />
        </ThemedOverlayCard>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedOverlayCard>
          <Link href="/modal">
            <Link.Trigger>
              <ThemedText type="subtitle">Step 2: Explore</ThemedText>
            </Link.Trigger>
            <Link.Preview />
            <Link.Menu>
              <Link.MenuAction
                title="Action"
                icon="cube"
                onPress={() => alert("Action pressed")}
              />
              <Link.MenuAction
                title="Share"
                icon="square.and.arrow.up"
                onPress={() => alert("Share pressed")}
              />
              <Link.Menu title="More" icon="ellipsis">
                <Link.MenuAction
                  title="Delete"
                  icon="trash"
                  destructive
                  onPress={() => alert("Delete pressed")}
                />
              </Link.Menu>
            </Link.Menu>
          </Link>
        </ThemedOverlayCard>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedOverlayCard>
          <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
          <ThemedText>
            {`When you're ready, run `}
            <ThemedText type="defaultSemiBold">
              npm run reset-project
            </ThemedText>{" "}
            to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
            directory. This will move the current{" "}
            <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
            <ThemedText type="defaultSemiBold">app-example</ThemedText>.
          </ThemedText>
        </ThemedOverlayCard>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    gap: 10,
  },
  stepContainer: {
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
