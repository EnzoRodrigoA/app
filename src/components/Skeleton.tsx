import { Layout } from "@ui-kitten/components";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export const Skeleton = ({
  width = "100%",
  height = 20,
  style,
  justifyContent,
}: any) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Layout style={{ alignItems: "center" }}>
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: 4,
            justifyContent,
            backgroundColor: "#E1E1E1",
            opacity,
          },
          style,
        ]}
      />
    </Layout>
  );
};
