import { Text, useTheme } from "@ui-kitten/components";
import type { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";

import { ThemedView } from "../components/themed-view";
import { useColorScheme } from "../hooks/use-color-scheme";

const HEADER_HEIGHT = 100;

type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerBackgroundColor,
}: Props) {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let todayString = today.toLocaleDateString("pt-BR", options);
  todayString = todayString.charAt(0).toUpperCase() + todayString.slice(1);

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor: theme["background-basic-color-1"], flex: 1 }}
      scrollEventThrottle={16}
    >
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}
      >
        <Text category="h4" style={{ marginBottom: 10 }}>
          Hoje
        </Text>
        <Text>{todayString}</Text>
      </Animated.View>

      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 16,
  },
  greetingContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  greeting: {
    fontWeight: "700",
    textAlign: "center",
  },
  avatarButton: {
    position: "absolute",
    bottom: 0,
    right: 16,
  },
});
