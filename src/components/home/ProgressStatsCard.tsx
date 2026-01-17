import { Card } from "@/components/UI/Card"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { UserStats } from "@/types"
import { ANIMATION_DELAYS, ANIMATION_DURATION } from "@/utils/constants"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

interface ProgressStatsCardProps {
  stats: UserStats | null
}

export const ProgressStatsCard = ({ stats }: ProgressStatsCardProps) => {
  const { theme } = useTheme()
  const router = useRouter()

  return (
    <Animated.View
      entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_DELAYS.stats)}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <Text variant="caption" color="secondary" style={{ fontWeight: "600", letterSpacing: 1 }}>
          CONQUISTAS
        </Text>
        <Pressable onPress={() => router.push("/dashboard" as any)}>
          <Text variant="caption" color="primary">
            Ver mais →
          </Text>
        </Pressable>
      </View>

      <Card
        variant="elevated"
        style={[
          styles.progressStatsCard,
          {
            backgroundColor: theme.colors.background.paper,
            borderColor: theme.colors.border
          }
        ]}
      >
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text variant="h1" color="primary" style={{ fontSize: 26 }}>
              {stats?.totalWorkouts || 0}
            </Text>
            <Text variant="small" color="secondary">
              Treinos totais
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.gray[200] }]} />
          <View style={styles.statItem}>
            <Text variant="h1" color="success" style={{ fontSize: 26 }}>
              {stats?.longestStreak || 0}
            </Text>
            <Text variant="small" color="secondary">
              Maior streak
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  progressStatsCard: {
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  statItem: {
    flex: 1,
    alignItems: "center"
  },
  statDivider: {
    width: 1,
    height: 32
  }
})
