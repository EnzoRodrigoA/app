// ============================================
// LIFTLOG - Home Screen
// ============================================

import { Card } from "@/components/UI/Card";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { workoutService, userService, streakService } from "@/services/mockService";
import { TodayWorkout, UserStats } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [todayWorkout, setTodayWorkout] = useState<TodayWorkout | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userName, setUserName] = useState("Atleta");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const streakScale = useSharedValue(1);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const loadData = useCallback(async () => {
    try {
      const [workout, stats, user] = await Promise.all([
        workoutService.getTodayWorkout(),
        userService.getStats(),
        userService.getUser(),
      ]);

      setTodayWorkout(workout);
      setUserStats(stats);
      setUserName(user.name);

      // Check streak status
      await streakService.checkAndUpdateStreak();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStartWorkout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (todayWorkout?.workout) {
      router.push(`/workout/${todayWorkout.workout.id}` as any);
    }
  };

  const handleQuickAction = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  // Animated streak style
  const streakAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  const handleStreakPress = () => {
    streakScale.value = withSpring(1.1, {}, () => {
      streakScale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Calculate weekly progress percentage
  const weeklyProgress = userStats
    ? Math.round((userStats.weeklyCompleted / userStats.weeklyGoal) * 100)
    : 0;

  // Check if user trained today
  const trainedToday = userStats?.lastWorkoutDate
    ? new Date(userStats.lastWorkoutDate).toDateString() === new Date().toDateString()
    : false;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary[500]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <View>
          <Text variant="body" color="secondary">
            {getGreeting()},
          </Text>
          <Text variant="h1" style={styles.userName}>
            {userName}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/profile" as any)}
          style={[styles.avatarButton, { backgroundColor: theme.colors.primary[100] }]}
        >
          <Ionicons name="person" size={24} color={theme.colors.primary[500]} />
        </Pressable>
      </Animated.View>

      {/* Streak Banner */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <Pressable onPress={handleStreakPress}>
          <Animated.View
            style={[
              styles.streakBanner,
              { backgroundColor: theme.colors.background.secondary },
              streakAnimatedStyle,
            ]}
          >
            <View style={styles.streakLeft}>
              <View style={styles.streakIconContainer}>
                <Text style={styles.fireEmoji}>🔥</Text>
              </View>
              <View>
                <Text variant="h2" style={styles.streakNumber}>
                  {userStats?.currentStreak || 0} dias
                </Text>
                <Text variant="caption" color="secondary">
                  {trainedToday ? "Streak ativo!" : "Treine hoje para manter"}
                </Text>
              </View>
            </View>
            <View style={styles.streakRight}>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.colors.gray[200] },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: theme.colors.primary[500],
                        width: `${Math.min(weeklyProgress, 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text variant="small" color="secondary">
                  {userStats?.weeklyCompleted || 0}/{userStats?.weeklyGoal || 5} esta semana
                </Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>

      {/* Today's Workout Card */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
        <Text variant="caption" color="secondary" style={styles.sectionLabel}>
          HOJE É DIA DE
        </Text>

        {loading ? (
          <Card variant="elevated" style={styles.workoutCard}>
            <View style={styles.skeletonContent}>
              <View style={[styles.skeleton, { width: "60%", height: 28 }]} />
              <View style={[styles.skeleton, { width: "40%", height: 16, marginTop: 8 }]} />
            </View>
          </Card>
        ) : todayWorkout?.isRestDay ? (
          <Card
            variant="filled"
            style={[styles.workoutCard, { backgroundColor: theme.colors.gray[100] }]}
          >
            <View style={styles.workoutCardContent}>
              <View style={styles.workoutInfo}>
                <View style={styles.workoutIconContainer}>
                  <Text style={styles.restEmoji}>😴</Text>
                </View>
                <View style={styles.workoutTextContainer}>
                  <Text variant="h2">Descanso</Text>
                  <Text variant="caption" color="secondary">
                    Recuperação é parte do progresso
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ) : todayWorkout?.workout ? (
          <Card
            variant="filled"
            style={[styles.workoutCard, { backgroundColor: theme.colors.primary[500] }]}
            onPress={handleStartWorkout}
          >
            <View style={styles.workoutCardContent}>
              <View style={styles.workoutInfo}>
                <View
                  style={[
                    styles.workoutIconContainer,
                    { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Text style={styles.workoutEmoji}>💪</Text>
                </View>
                <View style={styles.workoutTextContainer}>
                  <Text variant="h2" color="inverse">
                    {todayWorkout.workout.name}
                  </Text>
                  <Text variant="caption" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {todayWorkout.workout.exercises.length} exercícios •{" "}
                    ~{todayWorkout.workout.estimatedMinutes || 45}min
                  </Text>
                </View>
              </View>
              <View style={styles.startButtonContainer}>
                <View
                  style={[
                    styles.startButton,
                    { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Text variant="button" color="inverse">
                    INICIAR
                  </Text>
                  <Ionicons name="play" size={18} color="white" />
                </View>
              </View>
            </View>
          </Card>
        ) : (
          <Card
            variant="outlined"
            style={styles.workoutCard}
            onPress={() => router.push("/workout" as any)}
          >
            <View style={styles.noWorkoutContent}>
              <Ionicons
                name="add-circle-outline"
                size={32}
                color={theme.colors.primary[500]}
              />
              <Text variant="body" color="secondary">
                Nenhum treino programado
              </Text>
              <Text variant="caption" color="primary">
                Toque para configurar
              </Text>
            </View>
          </Card>
        )}
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
        <View style={styles.quickActionsRow}>
          <Pressable
            style={[styles.quickAction, { backgroundColor: theme.colors.success[50] }]}
            onPress={() => handleQuickAction("/workout")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.success[100] }]}>
              <Ionicons name="fitness-outline" size={24} color={theme.colors.success[600]} />
            </View>
            <Text variant="caption" style={{ color: theme.colors.success[700] }}>
              Cardio
            </Text>
          </Pressable>

          <Pressable
            style={[styles.quickAction, { backgroundColor: theme.colors.warning[50] }]}
            onPress={() => handleQuickAction("/workout")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.warning[100] }]}>
              <Ionicons name="bed-outline" size={24} color={theme.colors.warning[600]} />
            </View>
            <Text variant="caption" style={{ color: theme.colors.warning[700] }}>
              Rest Day
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Progress Preview */}
      <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h3">Seu Progresso</Text>
          <Pressable onPress={() => router.push("/dashboard" as any)}>
            <Text variant="caption" color="primary">
              Ver mais →
            </Text>
          </Pressable>
        </View>

        <Card variant="elevated" style={styles.progressCard}>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text variant="h2" color="primary">
                {userStats?.totalWorkouts || 0}
              </Text>
              <Text variant="small" color="secondary">
                Treinos totais
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.gray[200] }]} />
            <View style={styles.statItem}>
              <Text variant="h2" color="success">
                {userStats?.longestStreak || 0}
              </Text>
              <Text variant="small" color="secondary">
                Maior streak
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.gray[200] }]} />
            <View style={styles.statItem}>
              <Text variant="h2" color="warning">
                {userStats ? Math.round(userStats.totalVolume / 1000) : 0}t
              </Text>
              <Text variant="small" color="secondary">
                Volume total
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Insight/Tip */}
      {userStats && userStats.currentStreak > 0 && (
        <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
          <Card
            variant="filled"
            style={[styles.tipCard, { backgroundColor: theme.colors.info[50] }]}
          >
            <View style={styles.tipContent}>
              <Text style={styles.tipEmoji}>💡</Text>
              <View style={styles.tipTextContainer}>
                <Text variant="bodyMedium" color="info">
                  Dica do Coach
                </Text>
                <Text variant="caption" style={{ color: theme.colors.info[600] }}>
                  {userStats.currentStreak >= 7
                    ? "Você está voando! Considere uma semana de deload em breve."
                    : "Continue assim! Consistência é a chave para resultados."}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  userName: {
    fontSize: 28,
    marginTop: 4,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  // Streak Banner
  streakBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  streakLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  fireEmoji: {
    fontSize: 28,
  },
  streakNumber: {
    fontSize: 22,
  },
  streakRight: {
    alignItems: "flex-end",
  },
  progressContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  progressBar: {
    width: 80,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 12,
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  // Workout Card
  workoutCard: {
    borderRadius: 20,
    padding: 20,
  },
  workoutCardContent: {
    gap: 16,
  },
  workoutInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  workoutIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  workoutEmoji: {
    fontSize: 28,
  },
  restEmoji: {
    fontSize: 28,
  },
  workoutTextContainer: {
    flex: 1,
    gap: 4,
  },
  startButtonContainer: {
    alignItems: "flex-end",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  noWorkoutContent: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
  },

  // Skeleton
  skeletonContent: {
    padding: 20,
  },
  skeleton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // Progress Card
  progressCard: {
    borderRadius: 16,
    padding: 20,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
  },

  // Tip Card
  tipCard: {
    borderRadius: 16,
    padding: 16,
  },
  tipContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipTextContainer: {
    flex: 1,
    gap: 4,
  },
});
