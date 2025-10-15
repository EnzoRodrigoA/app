import { Text, useFont } from "@shopify/react-native-skia";

type Props = {
  x: number;
  y: number;
  text: string;
  color: string;
};

const XAxisText = ({ x, y, text, color }: Props) => {
  const font = useFont(
    require("../../../../assets/fonts/Teko/Teko-Regular.ttf")
  );

  if (!font) {
    return null;
  }

  const fontSize = font.measureText(text);

  return (
    <Text
      text={text}
      color={color}
      font={font}
      x={x - fontSize?.width / 2}
      y={y - 5}
    />
  );
};

export default XAxisText;
