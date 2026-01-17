import { useTheme } from "@/contexts/ThemeContext"

import React, { useRef } from "react"
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native"

interface ButtonProps {
  title?: string
  icon?: React.ReactNode
  type?: "primary" | "secondary"
  shape?: "default" | "circular"
  size?: number
  style?: ViewStyle
  textStyle?: TextStyle
  onPress?: () => void
  disabled?: boolean
  backgroundColor?: string
  shadowColor?: string
  borderColor?: string
}

const Button: React.FC<ButtonProps> = ({
  title,
  icon,
  type = "primary",
  shape = "default",
  size = 56,
  style,
  textStyle,
  onPress,
  disabled = false,
  backgroundColor,
  shadowColor: customShadowColor,
  borderColor
}) => {
  const animation = useRef(new Animated.Value(0)).current
  const theme = useTheme()

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: false,
      friction: 10,
      tension: 150
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: false,
      friction: 10,
      tension: 150
    }).start()
  }

  const baseTypeStyles =
    type === "primary"
      ? {
          backgroundColor: theme.theme.colors.primary[600],
          shadowColor: theme.theme.colors.primary[500],
          shadowOpacity: 1,
          textColor: "#fff"
        }
      : {
          backgroundColor: "#606060",
          shadowColor: "#A9A9A9",
          shadowOpacity: 1,
          textColor: "#ffffff"
        }

  // Override with custom colors if provided
  const typeStyles = {
    ...baseTypeStyles,
    ...(backgroundColor && { backgroundColor }),
    ...(customShadowColor && { shadowColor: customShadowColor }),
    ...(disabled && { shadowOpacity: 0.3 })
  }

  // Interpolação da animação para translateY e sombra
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4]
  })

  const elevation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 1]
  })

  const shadowOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  })

  const isCircular = shape === "circular"

  const circularStyles = isCircular
    ? {
        width: size,
        height: size,
        borderRadius: size / 2,
        paddingVertical: 0,
        paddingHorizontal: 0,
        margin: 0
      }
    : {}

  return (
    <Pressable
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={{ alignItems: "center", opacity: disabled ? 0.6 : 1 }}
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
            ...(borderColor && { borderWidth: 4, borderBottomWidth: 6, borderColor })
          },
          circularStyles,
          style
        ]}
      >
        <View style={styles.content}>
          {icon && (
            <View
              style={
                isCircular
                  ? {
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%"
                    }
                  : { marginRight: 8 }
              }
            >
              {icon}
            </View>
          )}
          {!isCircular && title && (
            <Text style={[styles.text, { color: typeStyles.textColor }, textStyle]}>{title}</Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  )
}

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
        elevation: 6
      }
    })
  },
  content: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontWeight: "bold",
    fontSize: 16
  }
})

export default Button
