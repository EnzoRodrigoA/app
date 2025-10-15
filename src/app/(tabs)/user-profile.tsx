import { AnimatedIcon } from "@/components/animated-icon";
import { Skeleton } from "@/components/UI/Feedback/Skeleton";
import ParallaxScrollView from "@/components/UI/Layout/ParallaxScrollView";
import { Text } from "@/components/UI/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

export default function HomeScreen() {
  const { logout, isLoggedIn } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<{ username: string; email: string } | null>(
    null
  );
  const [settings, setSettings] = useState<{
    weight: number;
    height: number;
    goal: string;
  } | null>(null);

  const handleLogout = async () => {
    await logout();
    router.replace("/sign-in");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userResponse, settingsResponse] = await Promise.all([
          api.get("/user"),
          api.get("/user-settings"),
        ]);
        setUser(userResponse.data);
        if (!settingsResponse.data) {
          router.replace("/onboarding");
        } else {
          setSettings(settingsResponse.data);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn, router]);

  return loading && !settings ? (
    <View
      style={[
        styles.skeletonContainer,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Skeleton
        style={{
          width: "80%",
          height: 80,
          marginBottom: 16,
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
      <Animated.View entering={FadeInRight.duration(600).delay(300)}>
        {settings && (
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.background.tertiary,
              },
            ]}
          >
            <Text variant="h2" style={styles.cardTitle}>
              Seus dados
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.background.tertiary },
              ]}
            />
            <View style={styles.row}>
              <Ionicons
                name="barbell-outline"
                size={22}
                color={theme.colors.primary[500]}
              />
              <Text variant="body" style={styles.infoText}>
                Objetivo: {settings.goal}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons
                name="fitness-outline"
                size={22}
                color={theme.colors.success}
              />
              <Text variant="body" style={styles.infoText}>
                Peso: {settings.weight} kg
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons
                name="body-outline"
                size={22}
                color={theme.colors.warning}
              />
              <Text variant="body" style={styles.infoText}>
                Altura: {settings.height} cm
              </Text>
            </View>
          </View>
        )}
      </Animated.View>
      <Animated.View entering={FadeInRight.duration(600).delay(600)}>
        <View style={styles.topBar}>
          <Text variant="body" style={{ color: theme.colors.error }}>
            Sair
          </Text>
          <Pressable onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={theme.colors.error}
            />
          </Pressable>
        </View>
      </Animated.View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 70,
    paddingHorizontal: 12,
  },
  container: { flex: 1 },
  scrollContainer: { padding: 20, gap: 20 },
  topBar: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    marginBottom: 20,
  },
  infoCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 6,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
  },
  mainCard: {
    borderRadius: 24,
    padding: 24,
  },
  mainCardText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});
