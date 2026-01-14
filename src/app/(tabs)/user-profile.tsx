import { AnimatedIcon } from "@/components/UI/animated-icon"
import { Card } from "@/components/UI/Card"
import { Skeleton } from "@/components/UI/Feedback/Skeleton"
import ParallaxScrollView from "@/components/UI/Layout/ParallaxScrollView"
import { ExpandableCard } from "@/components/UI/Lists/ExpandableCard"
import { Text } from "@/components/UI/Text"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import api from "@/services/api"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeInRight } from "react-native-reanimated"

export default function UserProfileScreen() {
  const { logout, isLoggedIn } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState<{ username: string; email: string } | null>(null)
  const [settings, setSettings] = useState<{
    weight: number
    height: number
    goal: string
  } | null>(null)

  const handleLogout = async () => {
    await logout()
    router.replace("/sign-in")
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [userResponse, settingsResponse] = await Promise.all([
          api.get("/user"),
          api.get("/user-settings")
        ])
        setUser(userResponse.data)
        if (!settingsResponse.data) {
          router.replace("/onboarding")
        } else {
          setSettings(settingsResponse.data)
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isLoggedIn, router])

  return loading && !settings ? (
    <View style={[styles.skeletonContainer, { backgroundColor: theme.colors.background.primary }]}>
      <Skeleton
        style={{
          width: "80%",
          height: 80,
          marginBottom: 16
        }}
      />
      <Skeleton style={{ width: "100%", height: 200, marginBottom: 12 }} />
      <Skeleton style={{ width: "100%", height: 60 }} />
    </View>
  ) : (
    <ParallaxScrollView
      title={
        !loading && user ? (
          <>
            Olá {user?.username}! <AnimatedIcon emoji="👋" />
          </>
        ) : undefined
      }
      subtitle={!loading && user ? user?.email : undefined}
    >
      <View style={styles.content}>
        {/* Dados Pessoais Card */}
        <Animated.View entering={FadeInRight.duration(600).delay(300)}>
          {settings && (
            <Card variant="elevated" style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text variant="h3">Dados Pessoais</Text>
                <Pressable style={styles.editButton}>
                  <Ionicons name="create-outline" size={20} color={theme.colors.primary[500]} />
                </Pressable>
              </View>

              <View style={styles.infoRows}>
                <View style={styles.row}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: theme.colors.primary[50] }]}
                  >
                    <Ionicons name="barbell-outline" size={20} color={theme.colors.primary[500]} />
                  </View>
                  <View style={styles.rowContent}>
                    <Text variant="caption" color="secondary">
                      Objetivo
                    </Text>
                    <Text variant="bodyMedium">{settings.goal}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: theme.colors.success[50] }]}
                  >
                    <Ionicons name="fitness-outline" size={20} color={theme.colors.success[500]} />
                  </View>
                  <View style={styles.rowContent}>
                    <Text variant="caption" color="secondary">
                      Peso
                    </Text>
                    <Text variant="bodyMedium">{settings.weight} kg</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View
                    style={[styles.iconContainer, { backgroundColor: theme.colors.warning[50] }]}
                  >
                    <Ionicons name="body-outline" size={20} color={theme.colors.warning[500]} />
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
          )}
        </Animated.View>

        {/* Estatísticas Rápidas */}
        <Animated.View entering={FadeInRight.duration(600).delay(400)}>
          <ExpandableCard title="Estatísticas" subtitle="Seus números gerais" showActions={false}>
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text variant="caption" color="secondary">
                  Total de Treinos
                </Text>
                <Text variant="h3" color="primary">
                  24
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="caption" color="secondary">
                  Volume Total
                </Text>
                <Text variant="h3" color="success">
                  1.2t
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="caption" color="secondary">
                  Dias Ativos
                </Text>
                <Text variant="h3" color="warning">
                  45
                </Text>
              </View>
            </View>
          </ExpandableCard>
        </Animated.View>

        {/* Preferências */}
        <Animated.View entering={FadeInRight.duration(600).delay(500)}>
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

        {/* Conta - Logout */}
        <Animated.View entering={FadeInRight.duration(600).delay(600)}>
          <Card
            variant="outlined"
            style={[styles.logoutCard, { borderColor: theme.colors.error[200] }]}
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
  skeletonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 70,
    paddingHorizontal: 24
  },
  content: {
    paddingHorizontal: 24,
    gap: 16
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
