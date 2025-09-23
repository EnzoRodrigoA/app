import { Skeleton } from "@/components/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Card, Divider, Layout, Text, useTheme } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

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
      try {
        const [userResponse, settingsResponse] = await Promise.all([
          api.get("/user"),
          api.get("/user-settings"),
          setLoading(true),
        ]);
        setUser(userResponse.data);
        setSettings(settingsResponse.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={theme["color-danger-500"]}
            />
          </Pressable>
          <Pressable onPress={() => router.replace("/(tabs)")}>
            <Ionicons
              name="chevron-forward"
              size={28}
              color={theme["text-basic-color"]}
            />
          </Pressable>
        </View>

        {loading && (
          <Layout style={styles.skeletonContainer}>
            <Skeleton
              style={{
                width: "60%",
                height: 24,
                marginBottom: 16,
              }}
            />
            <Skeleton style={{ width: "100%", height: 48, marginBottom: 12 }} />
            <Skeleton style={{ width: "100%", height: 48 }} />
          </Layout>
        )}

        {user && (
          <View style={styles.greetingContainer}>
            <Text
              category="h4"
              style={{ color: theme["text-basic-color"], fontWeight: "bold" }}
            >
              Olá, {user.username} 👋
            </Text>
            <Text category="s2" style={{ color: theme["text-hint-color"] }}>
              {user.email}
            </Text>
          </View>
        )}

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
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  container: { flex: 1 },
  scrollContainer: { padding: 20, gap: 20 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
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
