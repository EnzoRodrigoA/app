import Animated, {
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type SliceProps = {
  d: string;
  color: string;
};

const PieSlice = ({ d, color }: SliceProps) => {
  const animatedProps = useAnimatedProps(() => ({
    opacity: withTiming(1, { duration: 600 }),
  }));

  return <AnimatedPath d={d} fill={color} animatedProps={animatedProps} />;
};

type Slice = { value: number; color: string };

export const PieChart = ({
  data,
  radius,
}: {
  data: Slice[];
  radius: number;
}) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let startAngle = 0;

  return (
    <Svg width={radius * 2} height={radius * 2}>
      {data.map((slice, i) => {
        const angle = (slice.value / total) * 2 * Math.PI;
        const x1 = radius + radius * Math.cos(startAngle);
        const y1 = radius + radius * Math.sin(startAngle);
        const x2 = radius + radius * Math.cos(startAngle + angle);
        const y2 = radius + radius * Math.sin(startAngle + angle);

        const largeArcFlag = angle > Math.PI ? 1 : 0;
        const pathData = `
          M ${radius},${radius}
          L ${x1},${y1}
          A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}
          Z
        `;

        startAngle += angle;

        return <PieSlice key={i} d={pathData} color={slice.color} />;
      })}
    </Svg>
  );
};
