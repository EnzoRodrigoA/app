import { useTheme } from "@/contexts/ThemeContext";
import type { PropsWithChildren, ReactElement } from "react";
import { RefreshControlProps, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";
import { Text } from "../Text";

import React from "react";

const HEADER_HEIGHT = 150;

type Props = PropsWithChildren<{
  title?: React.ReactNode;
  subtitle?: string;
  refreshControl?: ReactElement<RefreshControlProps>;
}>;

export default function ParallaxScrollView({
  children,
  title,
  subtitle,
  refreshControl,
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
      opacity: interpolate(scrollOffset.value, [0, HEADER_HEIGHT / 2], [1, 0]),
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT * 0.3]
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.container]}>
      <Animated.ScrollView
        ref={scrollRef}
        style={{
          backgroundColor: theme.theme.colors.background.primary,
          flex: 1,
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        entering={FadeIn.duration(600)}
        refreshControl={refreshControl}
      >
        <Animated.View
          style={[
            styles.header,
            {
              backgroundColor: theme.theme.colors.background.primary,
              height: HEADER_HEIGHT,
            },
            headerAnimatedStyle,
          ]}
        >
          <Text variant="h1" style={styles.title}>
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            { backgroundColor: theme.theme.colors.background.primary },
            contentAnimatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: "hidden",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: "TekoRegular",
    paddingTop: 10,
    fontSize: 38,
  },
  subtitle: {
    fontFamily: "RobotoLight",
    fontSize: 16,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
