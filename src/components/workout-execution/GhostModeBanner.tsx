import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import Animated, { SlideInRight } from "react-native-reanimated"

export function GhostModeBanner() {
  const { theme } = useTheme()

  return (
    <Animated.View
      entering={SlideInRight.duration(400).delay(200)}
      style={[styles.container, { backgroundColor: theme.colors.background.paper }]}
    >
      <View style={[styles.iconBg, { backgroundColor: theme.colors.primary[900] }]}>
        <Ionicons name="flash" size={14} color="white" />
      </View>

      <View style={styles.textContainer}>
        <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
          Ghost Mode Ativo
        </Text>
        <Text variant="small" color="secondary">
          Vamos usar suas séries do treino anterior para ajudar você a registrar as novas
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.colors.gray[400]} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    flex: 1
  }
})
