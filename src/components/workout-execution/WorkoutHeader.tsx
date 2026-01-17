import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { Image, Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

interface WorkoutHeaderProps {
  totalXP: number
  showBackButton: boolean
  onBack: () => void
  onClose: () => void
}

/**
 * Header gamificado da tela de execução de treino
 * Exibe XP, streak e controles de navegação
 */
export function WorkoutHeader({ totalXP, showBackButton, onBack, onClose }: WorkoutHeaderProps) {
  const { theme } = useTheme()

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
      <Pressable
        onPress={showBackButton ? onBack : onClose}
        style={[styles.headerButton, { backgroundColor: theme.colors.gray[100] }]}
      >
        <Ionicons
          name={showBackButton ? "chevron-back" : "close"}
          size={24}
          color={theme.colors.text.primary}
        />
      </Pressable>

      <View style={styles.headerCenter}>
        <View style={[styles.xpBadge, { backgroundColor: theme.colors.warning[500] }]}>
          <Ionicons name="flash" size={14} color="white" />
          <Text variant="small" style={styles.xpText}>
            {totalXP} XP
          </Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        <View style={[styles.streakBadge, { backgroundColor: theme.colors.error[50] }]}>
          <Image source={require("../../assets/images/app-icon.png")} style={styles.streakIcon} />
          <Text variant="small" style={{ color: theme.colors.error[500], fontWeight: "700" }}>
            3
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center"
  },
  headerCenter: {
    flex: 1,
    alignItems: "center"
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  xpText: {
    color: "white",
    fontWeight: "700"
  },
  headerRight: {
    alignItems: "flex-end"
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16
  },
  streakIcon: {
    width: 18,
    height: 18
  }
})
