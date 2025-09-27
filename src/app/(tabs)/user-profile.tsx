import { AnimatedIcon } from "@/components/animated-icon";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Skeleton } from "@/components/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Card, Divider, Layout, Text, useTheme } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

export default function HomeScreen() {
  const { logout, isLoggedIn } = useAuth();
  const theme = useTheme();
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
    <Layout style={styles.skeletonContainer}>
      <Skeleton
        style={{
          width: "80%",
          height: 80,
          marginBottom: 16,
        }}
      />
      <Skeleton style={{ width: "100%", height: 200, marginBottom: 12 }} />
      <Skeleton style={{ width: "100%", height: 60 }} />
    </Layout>
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
          <Card style={styles.infoCard}>
            <Text category="s1" style={styles.cardTitle}>
              Seus dados
            </Text>
            <Divider style={{ marginVertical: 8 }} />
            <View style={styles.row}>
              <Ionicons
                name="barbell-outline"
                size={22}
                color={theme["color-primary-500"]}
              />
              <Text style={styles.infoText}>Objetivo: {settings.goal}</Text>
            </View>
            <View style={styles.row}>
              <Ionicons
                name="fitness-outline"
                size={22}
                color={theme["color-success-500"]}
              />
              <Text style={styles.infoText}>Peso: {settings.weight} kg</Text>
            </View>
            <View style={styles.row}>
              <Ionicons
                name="body-outline"
                size={22}
                color={theme["color-warning-500"]}
              />
              <Text style={styles.infoText}>Altura: {settings.height} cm</Text>
            </View>
          </Card>
        )}
      </Animated.View>
      <Animated.View entering={FadeInRight.duration(600).delay(600)}>
        <View style={styles.topBar}>
          <Text status="danger">Sair</Text>
          <Pressable onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={theme["color-danger-500"]}
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
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
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
