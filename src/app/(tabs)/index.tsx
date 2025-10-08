// app/(tabs)/index.tsx
import { AnimatedBarChart } from "@/components/AnimatedBarChart";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { data } from "@/constants/constants";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Card, Text, useTheme } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface todayWorkout {
  id: string;
  name: string;
  workout_id: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [todayWorkout, setTodayWorkout] = useState<todayWorkout | null>(null);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let todayString = today.toLocaleDateString("pt-BR", options);
  todayString = todayString.charAt(0).toUpperCase() + todayString.slice(1);

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      try {
        const response = await api.get<todayWorkout>("/workouts/today");
        setTodayWorkout(response.data);
      } catch (error) {
        console.error("Erro ao buscar treino de hoje:", error);
      }
    };

    fetchTodayWorkout();
  }, []);

  return (
    <ParallaxScrollView title="Hoje" subtitle={todayString}>
      {/* Card do Treino de Hoje */}
      <View style={styles.section}>
        <Card
          onPress={() =>
            router.push(`/complete-workout/${todayWorkout?.workout_id}`)
          }
          style={[
            styles.todayWorkoutCard,
            {
              backgroundColor: theme["color-primary-600"],
              borderColor: theme["color-primary-500"],
            },
          ]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text category="s2" style={styles.cardLabel}>
                {todayWorkout ? "TREINO DE HOJE" : "DIA DE DESCANSO"}
              </Text>
              <Text category="h5" style={styles.cardTitle}>
                {todayWorkout?.name || "Descanso Ativo"}
              </Text>
              <Text category="p2" style={styles.cardDescription}>
                {todayWorkout
                  ? "Toque para iniciar o treino"
                  : "Aproveite para se recuperar!"}
              </Text>
            </View>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: todayWorkout
                    ? theme["color-primary-400"]
                    : theme["color-basic-600"],
                },
              ]}
            >
              <Ionicons
                name={todayWorkout ? "play" : "bed-outline"}
                size={24}
                color="white"
              />
            </View>
          </View>
        </Card>
      </View>

      {/* Navegação Rápida */}
      <View style={styles.section}>
        <Text category="h6" style={styles.sectionTitle}>
          Acesso Rápido
        </Text>

        <Pressable
          onPress={() => router.replace("/workout")}
          style={[
            styles.navCard,
            { backgroundColor: theme["color-primary-200"] },
          ]}
        >
          <View
            style={[
              styles.navIcon,
              { backgroundColor: theme["color-primary-300"] },
            ]}
          >
            <Ionicons
              name="barbell-outline"
              size={24}
              color={theme["color-primary-500"]}
            />
          </View>
          <View style={styles.navTextContainer}>
            <Text
              category="s1"
              style={[styles.navTitle, { color: theme["color-primary-700"] }]}
            >
              Meus Treinos
            </Text>
            <Text
              category="c1"
              style={[
                styles.navSubtitle,
                { color: theme["color-primary-900"] },
              ]}
            >
              Gerencie sua rotina
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push("/dashboard")}
          style={[
            styles.navCard,
            { backgroundColor: theme["color-success-200"] },
          ]}
        >
          <View
            style={[
              styles.navIcon,
              { backgroundColor: theme["color-success-300"] },
            ]}
          >
            <Ionicons
              name="stats-chart-outline"
              size={24}
              color={theme["color-success-700"]}
            />
          </View>
          <View style={styles.navTextContainer}>
            <Text
              category="s1"
              style={[styles.navTitle, { color: theme["color-success-700"] }]}
            >
              Meu Progresso
            </Text>
            <Text
              category="c1"
              style={[
                styles.navSubtitle,
                { color: theme["color-success-900"] },
              ]}
            >
              Acompanhe resultados
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Gráfico de Progresso */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <Text category="h6" style={styles.sectionTitle}>
            Progresso Semanal
          </Text>
          <Pressable onPress={() => router.push("/dashboard")}>
            <Text
              category="c1"
              style={[styles.seeAllText, { color: theme["color-primary-500"] }]}
            >
              Ver detalhes
            </Text>
          </Pressable>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <AnimatedBarChart
            weeks={data}
            activeWeekIndex={activeWeekIndex}
            onWeekChange={setActiveWeekIndex}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "TekoRegular",
    fontSize: 22,
    marginBottom: 16,
  },
  // Card do Treino de Hoje
  todayWorkoutCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  cardLabel: {
    color: "white",
    opacity: 0.9,
    fontFamily: "RobotoLight",
    fontSize: 12,
    marginBottom: 4,
  },
  cardTitle: {
    color: "white",
    fontFamily: "TekoRegular",
    fontSize: 24,
    marginBottom: 8,
  },
  cardDescription: {
    color: "white",
    opacity: 0.8,
    fontFamily: "RobotoLight",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  // Navegação Rápida
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  navTextContainer: {
    flex: 1,
  },
  navTitle: {
    fontFamily: "TekoRegular",
    fontSize: 18,
    marginBottom: 2,
  },
  navSubtitle: {
    fontFamily: "RobotoLight",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontFamily: "RobotoLight",
  },
});
