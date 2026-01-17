// ============================================
// LIFTLOG - Home Screen (Clean Architecture)
// ============================================

import { HomeHeader } from "@/components/home/HomeHeader"
import { InsightPreviewCard } from "@/components/home/InsightPreviewCard"
import { ProgressStatsCard } from "@/components/home/ProgressStatsCard"
import { ProPlanCard } from "@/components/home/ProPlanCard"
import { TipCard } from "@/components/home/TipCard"
import { WeeklyProgressCard } from "@/components/home/WeeklyProgressCard"
import { WorkoutCard } from "@/components/home/WorkoutCard"
import { useTheme } from "@/contexts/ThemeContext"
import { useHomeData } from "@/hooks/use-home-data"
import { useWeeklyProgress } from "@/hooks/use-weekly-progress"
import { useWorkoutActions } from "@/hooks/use-workout-actions"
import { useRouter } from "expo-router"
import { RefreshControl, ScrollView, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

/**
 * Home Screen Component
 * Main dashboard showing daily workout, streak, progress, and insights
 *
 * Architecture:
 * - Pure composition of extracted components
 * - Business logic delegated to custom hooks
 * - Follows Single Responsibility Principle
 */
export default function HomeScreen() {
  const router = useRouter()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  // Custom hooks for data and actions
  const { workout, stats, loading, refreshing, refresh } = useHomeData()
  const { startWorkout, configureWorkout } = useWorkoutActions()
  const { progress } = useWeeklyProgress(stats)

  // Navigation handlers
  const handleAvatarPress = () => router.push("/user-profile" as any)

  // Mock weekly data for InsightPreviewCard
  // TODO: Move to service layer when real data is available
  const weeklyData = [
    { day: "seg", value: 0.8, label: "S" },
    { day: "ter", value: 0.6, label: "T" },
    { day: "qua", value: 1.0, label: "Q" },
    { day: "qui", value: 0.4, label: "Q" },
    { day: "sex", value: 0.9, label: "S" },
    { day: "sáb", value: 0.0, label: "S" },
    { day: "dom", value: 0.0, label: "D" }
  ]

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={theme.colors.primary[500]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader
        currentStreak={stats?.currentStreak ?? 0}
        workoutName={workout?.workout?.name}
        onAvatarPress={handleAvatarPress}
      />

      <WorkoutCard
        workout={workout}
        loading={loading}
        onStart={startWorkout}
        onConfigure={configureWorkout}
      />

      <ProgressStatsCard stats={stats} />

      <WeeklyProgressCard
        completed={stats?.weeklyCompleted ?? 0}
        goal={stats?.weeklyGoal ?? 5}
        progress={progress}
      />

      <InsightPreviewCard
        weeklyData={weeklyData}
        trend={15}
        totalWorkouts={stats?.weeklyCompleted ?? 0}
      />

      <TipCard streak={stats?.currentStreak ?? 0} />

      <ProPlanCard />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: 24
  }
})
