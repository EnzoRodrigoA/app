import { Circle, Group, Path, Skia } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

type Props = {
  cx: SharedValue<number>;
  cy: SharedValue<number>;
  chartHeight: number;
  cursorColor: string;
};

const Cursor = ({ cx, cy, chartHeight, cursorColor }: Props) => {
  const path = useDerivedValue(() => {
    const dottedLine = Skia.Path.Make().lineTo(0, chartHeight - 20 - cy.value);
    dottedLine.dash(10, 10, 0);

    const matrix = Skia.Matrix();
    matrix.translate(cx.value, cy.value);
    dottedLine.transform(matrix);

    return dottedLine;
  });

  return (
    <Group>
      <Path
        path={path}
        color={cursorColor}
        style={"stroke"}
        strokeWidth={2}
        strokeCap={"round"}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={10}
        style={"stroke"}
        strokeWidth={5}
        color={cursorColor}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={10}
        style={"fill"}
        strokeWidth={10}
        color={"#0d0d0d"}
      />
    </Group>
  );
};

export default Cursor;
