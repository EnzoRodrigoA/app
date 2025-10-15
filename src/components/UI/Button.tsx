import { useTheme } from "@/contexts/ThemeContext";

import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  icon?: React.ReactNode;
  type?: "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  title,
  icon,
  type = "primary",
  style,
  textStyle,
  onPress,
}) => {
  const animation = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: false,
      friction: 10,
      tension: 150,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: false,
      friction: 10,
      tension: 150,
    }).start();
  };

  const typeStyles =
    type === "primary"
      ? {
          backgroundColor: theme.theme.colors.primary[600],
          shadowColor: theme.theme.colors.primary[500],
          shadowOpacity: 1,
          textColor: "#fff",
        }
      : {
          backgroundColor: "#606060",
          shadowColor: "#A9A9A9",
          shadowOpacity: 1,
          textColor: "#ffffff",
        };

  // Interpolação da animação para translateY e sombra
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  const elevation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 1],
  });

  const shadowOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={{ alignItems: "center" }}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: typeStyles.backgroundColor,
            shadowColor: typeStyles.shadowColor,
            transform: [{ translateY }],
            shadowOpacity,
            elevation,
          },
          style,
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text
            style={[styles.text, { color: typeStyles.textColor }, textStyle]}
          >
            {title}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    margin: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    ...Platform.select({
      android: {
        elevation: 6,
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Button;
