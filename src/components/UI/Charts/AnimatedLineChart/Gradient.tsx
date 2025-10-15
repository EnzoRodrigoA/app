import { LinearGradient, Path, Skia } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

type Props = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
  curvedLine: string;
  colorStart: string;
  colorEnd: string;
  animationGradient: SharedValue<{ x: number; y: number }>;
};

const Gradient = ({
  chartHeight,
  chartWidth,
  chartMargin,
  curvedLine,
  colorStart,
  colorEnd,
  animationGradient,
}: Props) => {
  const getGradient = (chartLine: string, width: number, height: number) => {
    const gradientAreaSplit = Skia.Path.MakeFromSVGString(chartLine);

    if (gradientAreaSplit) {
      gradientAreaSplit
        .lineTo(width - chartMargin, height)
        .lineTo(chartMargin, height)
        .lineTo(chartMargin, gradientAreaSplit.getPoint(0).y);
    }

    return gradientAreaSplit;
  };

  return (
    <Path
      path={getGradient(curvedLine!, chartWidth, chartHeight)!}
      color={"pink"}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={animationGradient}
        colors={[colorStart, colorEnd]}
      />
    </Path>
  );
};

export default Gradient;
