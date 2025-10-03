import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ExpandableProps {
  expanded: boolean;
  children: React.ReactNode;
}

export function Expandable({ expanded, children }: ExpandableProps) {
  const [contentHeight, setContentHeight] = useState(0);

  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (expanded) {
      height.value = withTiming(contentHeight, { duration: 300 });
      opacity.value = withTiming(1, { duration: 500 });
    } else {
      height.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [expanded, contentHeight, height, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== contentHeight) {
      setContentHeight(h);
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.content} onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    width: "100%",
  },
});
