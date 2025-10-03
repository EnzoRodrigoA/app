import { useTheme } from "@ui-kitten/components";
import { format } from "date-fns";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export type Day = {
  day: Date;
  value: number;
};

type SingleBarProps = {
  maxHeight: number;
  width: number;

  day: Day;
};

export const SingleBar = ({ maxHeight, width, day }: SingleBarProps) => {
  const theme = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(maxHeight * day.value),
      opacity: withTiming(day.value),
    };
  }, [day.value, maxHeight]);

  return (
    <View>
      <Animated.View
        style={[
          {
            width: width,
            backgroundColor: theme["color-primary-500"],
            borderRadius: 15,
            borderCurve: "continuous",
          },
          animatedStyle,
        ]}
      />
      <Text
        style={{
          width: width,
          textAlign: "center",
          fontSize: 14,
          marginTop: 5,
          color: theme["text-basic-color"],
          fontFamily: "RobotoLight",
          textTransform: "lowercase",
        }}
      >
        {format(day.day, "eeeee")}
      </Text>
    </View>
  );
};
