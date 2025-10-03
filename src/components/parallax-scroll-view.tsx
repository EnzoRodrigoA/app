import { Text, useTheme } from "@ui-kitten/components";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";

import React from "react";

const HEADER_HEIGHT = 100;

type Props = PropsWithChildren<{
  title?: React.ReactNode;
  subtitle?: string;
}>;

export default function ParallaxScrollView({
  children,
  title,
  subtitle,
}: Props) {
  const theme = useTheme();
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

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor: theme["background-basic-color-1"], flex: 1 }}
      scrollEventThrottle={16}
      entering={FadeIn.duration(600)}
    >
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: theme["background-basic-color-1"] },
          headerAnimatedStyle,
        ]}
      >
        <Text category="h1" style={styles.title}>
          {title}
        </Text>
        <Text category="p1" style={styles.text}>
          {subtitle}
        </Text>
      </Animated.View>

      <View
        style={[
          styles.content,
          { backgroundColor: theme["background-basic-color-1"] },
        ]}
      >
        {children}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: "TekoMedium",
  },
  text: {
    fontFamily: "RobotoLight",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 16,
  },
});
