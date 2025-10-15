import { useTheme } from "@/contexts/ThemeContext";
import { Canvas, SkFont, Text } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

type Props = {
  selectedValue: SharedValue<number>;
  font: SkFont;
};

const AnimatedText = ({ font, selectedValue }: Props) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const MARGIN_VERTICAL = 80;

  const animatedText = useDerivedValue(() => {
    return `${Math.round(selectedValue.value)}`;
  }, [selectedValue]);

  const fontSize = font.measureText("0");

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(animatedText.value);
    return width / 2 - _fontSize.width;
  });

  return (
    <Canvas
      style={{
        height: 80,
        width: "100%",
        position: "absolute",
        top: 50,
      }}
    >
      <Text
        font={font}
        text={animatedText}
        color={theme.theme.colors.warning[700]}
        x={textX}
        y={fontSize.height + MARGIN_VERTICAL / 2}
      />
    </Canvas>
  );
};

export default AnimatedText;
