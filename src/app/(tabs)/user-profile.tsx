import { AnimatedIcon } from "@/components/UI/animated-icon"
import { Card } from "@/components/UI/Card"
import ParallaxScrollView from "@/components/UI/Layout/ParallaxScrollView"
import { ExpandableCard } from "@/components/UI/Lists/ExpandableCard"
import { Text } from "@/components/UI/Text"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { MOCK_USER, MOCK_USER_STATS } from "@/data/mockData"
import { USER_GOAL_LABELS } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeInRight } from "react-native-reanimated"

export default function UserProfileScreen() {
  const { logout, isLoggedIn } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  void isLoggedIn
  const user = MOCK_USER
  const stats = MOCK_USER_STATS
  const settings = {
    weight: 78,
    height: 178,
    goal: USER_GOAL_LABELS[user.goal] ?? "Hipertrofia"
  }

  const handleLogout = async () => {
    await logout()
    router.replace("/sign-in")
  }
  const formatVolume = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}t`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k kg`
    }
    return `${value} kg`
  }

  return (
    <ParallaxScrollView
      title={
        user ? (
          <>
            Olá {user.name}! <AnimatedIcon emoji="👋" />
          </>
        ) : undefined
      }
      subtitle={user ? user.email : undefined}
    >
      <View style={styles.content}>
        <Animated.View entering={FadeInRight.duration(600).delay(200)}>
          <Card variant="elevated" style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.avatar}>
                <Text variant="h3" style={{ color: theme.colors.primary[700] }}>
                  {user?.name?.charAt(0) ?? "U"}
                </Text>
              </View>
              <View style={styles.heroTitle}>
                <Text variant="h2">{user?.name}</Text>
                <Text variant="body" color="secondary">
                  {user?.email}
                </Text>
              </View>
            </View>

            <View style={styles.heroChipsRow}>
              <View style={[styles.chip, { backgroundColor: theme.colors.primary[50] }]}>
                <Ionicons name="flame" size={16} color={theme.colors.primary[700]} />
                <Text variant="captionMedium" style={{ color: theme.colors.primary[700] }}>
                  {stats.currentStreak} dias de streak
                </Text>
              </View>
              <View style={[styles.chip, { backgroundColor: theme.colors.success[50] }]}>
                <Ionicons name="barbell-outline" size={16} color={theme.colors.success[600]} />
                <Text variant="captionMedium" style={{ color: theme.colors.success[600] }}>
                  {stats.weeklyCompleted}/{stats.weeklyGoal} na semana
                </Text>
              </View>
            </View>

            <View
              style={[styles.heroStats, { backgroundColor: theme.colors.background.secondary }]}
            >
              <View style={styles.heroStatItem}>
                <Text variant="caption" color="secondary">
                  Total de treinos
                </Text>
                <Text variant="h3" color="primary">
                  {stats.totalWorkouts}
                </Text>
              </View>
              <View style={[styles.heroStatDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.heroStatItem}>
                <Text variant="caption" color="secondary">
                  Volume acumulado
                </Text>
                <Text variant="h3" color="success">
                  {formatVolume(stats.totalVolume)}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInRight.duration(600).delay(320)}>
          <Card variant="elevated" style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text variant="h3">Dados Pessoais</Text>
              <Pressable style={styles.editButton}>
                <Ionicons name="create-outline" size={20} color={theme.colors.primary[500]} />
              </Pressable>
            </View>

            <View style={styles.infoRows}>
              <View style={styles.row}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary[50] }]}>
                  <Ionicons name="barbell-outline" size={20} color={theme.colors.primary[600]} />
                </View>
                <View style={styles.rowContent}>
                  <Text variant="caption" color="secondary">
                    Objetivo
                  </Text>
                  <Text variant="bodyMedium">{settings.goal}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.success[50] }]}>
                  <Ionicons name="fitness-outline" size={20} color={theme.colors.success[600]} />
                </View>
                <View style={styles.rowContent}>
                  <Text variant="caption" color="secondary">
                    Peso
                  </Text>
                  <Text variant="bodyMedium">{settings.weight} kg</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.warning[50] }]}>
                  <Ionicons name="body-outline" size={20} color={theme.colors.warning[600]} />
                </View>
                <View style={styles.rowContent}>
                  <Text variant="caption" color="secondary">
                    Altura
                  </Text>
                  <Text variant="bodyMedium">{settings.height} cm</Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInRight.duration(600).delay(420)}>
          <ExpandableCard title="Estatísticas" subtitle="Seus números gerais" showActions={false}>
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text variant="caption" color="secondary">
                  Sequência atual
                </Text>
                <Text variant="h3" color="primary">
                  {stats.currentStreak} dias
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="caption" color="secondary">
                  Volume total
                </Text>
                <Text variant="h3" color="success">
                  {formatVolume(stats.totalVolume)}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="caption" color="secondary">
                  Melhor sequência
                </Text>
                <Text variant="h3" color="warning">
                  {stats.longestStreak} dias
                </Text>
              </View>
            </View>
          </ExpandableCard>
        </Animated.View>

        <Animated.View entering={FadeInRight.duration(600).delay(520)}>
          <ExpandableCard
            title="Preferências"
            subtitle="Personalize sua experiência"
            showActions={false}
          >
            <View style={styles.preferencesContainer}>
              <Pressable style={styles.preferenceRow}>
                <View style={styles.preferenceLeft}>
                  <Ionicons name="moon-outline" size={20} color={theme.colors.text.secondary} />
                  <Text variant="body">Tema Escuro</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
              </Pressable>

              <Pressable style={styles.preferenceRow}>
                <View style={styles.preferenceLeft}>
                  <Ionicons name="scale-outline" size={20} color={theme.colors.text.secondary} />
                  <Text variant="body">Unidades</Text>
                </View>
                <View style={styles.preferenceRight}>
                  <Text variant="caption" color="secondary">
                    Métrico
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
                </View>
              </Pressable>

              <Pressable style={styles.preferenceRow}>
                <View style={styles.preferenceLeft}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                  <Text variant="body">Notificações</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
              </Pressable>
            </View>
          </ExpandableCard>
        </Animated.View>

        <Animated.View entering={FadeInRight.duration(600).delay(620)}>
          <Card
            variant="outlined"
            style={[styles.logoutCard, { borderColor: theme.colors.error[500] }]}
          >
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <View style={styles.logoutContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.error[50] }]}>
                  <Ionicons name="log-out-outline" size={20} color={theme.colors.error[500]} />
                </View>
                <View style={styles.logoutTextContainer}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.error[600] }}>
                    Sair da Conta
                  </Text>
                  <Text variant="small" color="secondary">
                    Você precisará fazer login novamente
                  </Text>
                </View>
              </View>
            </Pressable>
          </Card>
        </Animated.View>
      </View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 16
  },

  heroCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center"
  },
  heroTitle: {
    flex: 1,
    gap: 2
  },
  heroChipsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap"
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    padding: 12
  },
  heroStatItem: {
    flex: 1,
    gap: 4
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginHorizontal: 12
  },

  // Info Card
  infoCard: {
    padding: 20,
    borderRadius: 16
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  editButton: {
    padding: 4
  },
  infoRows: {
    gap: 16 // Aumentado de marginVertical: 6 para gap: 16
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  rowContent: {
    flex: 1,
    gap: 2
  },

  // Stats Container (inside ExpandableCard)
  statsContainer: {
    gap: 16,
    paddingTop: 8
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  // Preferences Container (inside ExpandableCard)
  preferencesContainer: {
    paddingTop: 8
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  preferenceRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  // Logout Card
  logoutCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1
  },
  logoutButton: {
    width: "100%"
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  logoutTextContainer: {
    flex: 1,
    gap: 2
  }
})
