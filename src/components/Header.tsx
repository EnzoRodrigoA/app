import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  scrollY: Animated.Value;
  rightContent?: ReactNode;
}

export function Header({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  scrollY,
  rightContent,
}: HeaderProps) {
  const router = useRouter();

  // Animação de shrink mais suave
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [120, 10],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -8],
    extrapolate: "clamp",
  });

  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 0.1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          shadowOpacity: shadowOpacity,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          {showBackButton && (
            <Pressable
              style={styles.backButton}
              onPress={onBackPress || (() => router.back())}
            >
              <Ionicons name="chevron-back" size={24} color="#2D3748" />
            </Pressable>
          )}
        </View>

        <View style={styles.headerCenter}>
          <Animated.View
            style={{
              transform: [
                { scale: titleScale },
                { translateY: titleTranslateY },
              ],
            }}
          >
            <Text style={styles.headerTitle}>{title}</Text>
          </Animated.View>

          {subtitle && (
            <Animated.Text
              style={[styles.headerSubtitle, { opacity: subtitleOpacity }]}
            >
              {subtitle}
            </Animated.Text>
          )}
        </View>

        <View style={styles.headerRight}>{rightContent}</View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff0",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 16,
    elevation: 8,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "TekoRegular",
    fontSize: 32,
    color: "#1A202C",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#718096",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 4,
    fontSize: 14,
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
});
