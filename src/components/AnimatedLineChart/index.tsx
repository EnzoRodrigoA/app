import { useEffect } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Circle, Path, Svg } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type LineChartProps = {
  data: number[];
  labels: string[];
  width: number;
  height: number;
};

export const LineChart = ({ data, labels, width, height }: LineChartProps) => {
  const scheme = useColorScheme();
  const maxValue = Math.max(...data);
  const stepX = width / (data.length - 1);

  const points = data.map((val, index) => ({
    x: index * stepX,
    y: height - (val / maxValue) * height,
    value: val,
  }));

  const d = points.reduce(
    (acc, point, index) =>
      index === 0
        ? `M ${point.x},${point.y}`
        : `${acc} L ${point.x},${point.y}`,
    ""
  );

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 5000 });
  }, [progress]);

  const pathLength = Math.sqrt(width * width + height * height) * 1;
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value),
  }));

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Svg width={width} height={height}>
        <AnimatedPath
          d={d}
          stroke={scheme === "dark" ? "#B22222" : "#B22222"}
          strokeWidth={3}
          fill="none"
          strokeDasharray={pathLength}
          animatedProps={animatedProps}
        />

        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={scheme === "dark" ? "#B22222" : "#B22222"}
            opacity={(i / (data.length - 1)) * (1 - 0.3) + 0.3}
          />
        ))}
      </Svg>

      <View style={styles.legendContainer}>
        {labels.map((label, i) => (
          <Text
            key={i}
            style={[
              styles.legendText,
              { color: scheme === "dark" ? "white" : "black" },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
  },
  legendText: {
    fontSize: 12,
    fontFamily: "RobotoLight",
  },
});
