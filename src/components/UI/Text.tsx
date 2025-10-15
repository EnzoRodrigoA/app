import { useTheme } from "@/contexts/ThemeContext";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from "react-native";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "bodyMedium"
  | "caption"
  | "captionMedium"
  | "small"
  | "button";

export type TextColor =
  | "primary"
  | "secondary"
  | "disabled"
  | "inverse"
  | "placeholder"
  | "success"
  | "warning"
  | "error"
  | "info"
  | keyof TextStyle;

export type TextAlign = "auto" | "left" | "right" | "center" | "justify";
export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  transform?: TextTransform;
  weight?: "400" | "500" | "600" | "700";
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
  opacity?: number;
  useLineHeight?: boolean;
  testID?: string;
}

export const Text = ({
  variant = "body",
  color = "primary",
  align = "left",
  transform = "none",
  weight,
  numberOfLines,
  ellipsizeMode = "tail",
  opacity,
  useLineHeight = true,
  style,
  testID,
  ...props
}: TextProps) => {
  const { theme } = useTheme();

  const getTextStyle = (): TextStyle => {
    const themeStyle = theme.typography[variant];
    const colorValue = getColorValue(color, theme);

    const baseStyle: TextStyle = {
      fontSize: themeStyle.fontSize,
      fontWeight: weight || themeStyle.fontWeight,
      fontFamily: themeStyle.fontFamily,
      color: colorValue,
      textAlign: align,
      textTransform: transform,
      opacity,
    };

    if (useLineHeight && themeStyle.lineHeight) {
      baseStyle.lineHeight = themeStyle.lineHeight;
    }
    if (
      "letterSpacing" in themeStyle &&
      themeStyle.letterSpacing !== undefined
    ) {
      baseStyle.letterSpacing = themeStyle.letterSpacing;
    }

    return baseStyle;
  };

  return (
    <RNText
      style={[getTextStyle(), StyleSheet.flatten(style)]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      testID={testID}
      {...props}
    />
  );
};

const getColorValue = (color: TextColor, theme: any): string => {
  if (typeof color === "string" && color in theme.colors.text) {
    return theme.colors.text[color as keyof typeof theme.colors.text];
  }

  if (typeof color === "string" && color in theme.colors) {
    const colorGroup = theme.colors[color as keyof typeof theme.colors];
    if (typeof colorGroup === "string") {
      return colorGroup;
    }
    if (colorGroup && typeof colorGroup === "object" && "500" in colorGroup) {
      return colorGroup[500];
    }
  }

  return color as string;
};

export const H1 = (props: Omit<TextProps, "variant">) => (
  <Text variant="h1" {...props} />
);

export const H2 = (props: Omit<TextProps, "variant">) => (
  <Text variant="h2" {...props} />
);

export const H3 = (props: Omit<TextProps, "variant">) => (
  <Text variant="h3" {...props} />
);

export const H4 = (props: Omit<TextProps, "variant">) => (
  <Text variant="h4" {...props} />
);

export const Body = (props: Omit<TextProps, "variant">) => (
  <Text variant="body" {...props} />
);

export const BodyMedium = (props: Omit<TextProps, "variant">) => (
  <Text variant="bodyMedium" {...props} />
);

export const Caption = (props: Omit<TextProps, "variant">) => (
  <Text variant="caption" {...props} />
);

export const CaptionMedium = (props: Omit<TextProps, "variant">) => (
  <Text variant="captionMedium" {...props} />
);

export const Small = (props: Omit<TextProps, "variant">) => (
  <Text variant="small" {...props} />
);

export const ButtonText = (props: Omit<TextProps, "variant">) => (
  <Text variant="button" {...props} />
);

export const SuccessText = (props: Omit<TextProps, "color">) => (
  <Text color="success" {...props} />
);

export const ErrorText = (props: Omit<TextProps, "color">) => (
  <Text color="error" {...props} />
);

export const WarningText = (props: Omit<TextProps, "color">) => (
  <Text color="warning" {...props} />
);

export const InfoText = (props: Omit<TextProps, "color">) => (
  <Text color="info" {...props} />
);

export const DisabledText = (props: Omit<TextProps, "color">) => (
  <Text color="disabled" {...props} />
);

Text.H1 = H1;
Text.H2 = H2;
Text.H3 = H3;
Text.H4 = H4;
Text.Body = Body;
Text.BodyMedium = BodyMedium;
Text.Caption = Caption;
Text.CaptionMedium = CaptionMedium;
Text.Small = Small;
Text.Button = ButtonText;
Text.Success = SuccessText;
Text.Error = ErrorText;
Text.Warning = WarningText;
Text.Info = InfoText;
Text.Disabled = DisabledText;

export default Text;
