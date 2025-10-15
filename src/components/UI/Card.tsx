import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "small" | "medium" | "large";
  borderRadius?: "small" | "medium" | "large";
  testID?: string;
}

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export interface CardContentProps {
  children: React.ReactNode;
  padding?: "none" | "small" | "medium" | "large";
}

export interface CardFooterProps {
  children: React.ReactNode;
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
}

export interface CardActionProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export const Card = ({
  children,
  onPress,
  style,
  variant = "elevated",
  padding = "medium",
  borderRadius = "medium",
  testID,
}: CardProps) => {
  const { theme } = useTheme();

  const Container = (onPress ? Pressable : View) as React.ComponentType<{
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    testID?: string;
    children?: React.ReactNode;
  }>;

  const containerProps = onPress ? { onPress, testID } : { testID };

  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: getBorderRadius(),
      padding: getPadding(),
    };

    switch (variant) {
      case "elevated":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.background.paper,
          ...theme.shadows.md,
        };
      case "outlined":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.background.paper,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.background.secondary,
        };
      default:
        return baseStyle;
    }
  };

  const getPadding = () => {
    switch (padding) {
      case "none":
        return 0;
      case "small":
        return 12;
      case "large":
        return 24;
      case "medium":
      default:
        return 16;
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case "small":
        return 8;
      case "large":
        return 20;
      case "medium":
      default:
        return 12;
    }
  };

  return (
    <Container
      style={[getVariantStyles(), style, { overflow: "visible" }]}
      {...containerProps}
    >
      {children}
    </Container>
  );
};

export const CardHeader = ({
  title,
  subtitle,
  action,
  children,
}: CardHeaderProps) => {
  return (
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderContent}>
        {title && (
          <Text variant="h3" style={styles.cardTitle}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text variant="body" style={styles.cardSubtitle}>
            {subtitle}
          </Text>
        )}
        {children}
      </View>
      {action && <View style={styles.cardHeaderAction}>{action}</View>}
    </View>
  );
};

export const CardContent = ({
  children,
  padding = "medium",
}: CardContentProps) => {
  const getPadding = () => {
    switch (padding) {
      case "none":
        return 0;
      case "small":
        return 12;
      case "large":
        return 20;
      case "medium":
      default:
        return 16;
    }
  };

  return <View style={[, { padding: getPadding() }]}>{children}</View>;
};

export const CardFooter = ({
  children,
  justify = "flex-start",
}: CardFooterProps) => {
  return (
    <View style={[styles.cardFooter, { justifyContent: justify }]}>
      {children}
    </View>
  );
};

export const CardAction = ({
  children,
  onPress,
  disabled,
}: CardActionProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardAction,
        pressed && styles.cardActionPressed,
        disabled && styles.cardActionDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardHeaderAction: {
    marginLeft: 12,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardSubtitle: {
    opacity: 0.7,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  cardAction: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cardActionPressed: {
    opacity: 0.7,
  },
  cardActionDisabled: {
    opacity: 0.5,
  },
});

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Action = CardAction;

export default Card;
