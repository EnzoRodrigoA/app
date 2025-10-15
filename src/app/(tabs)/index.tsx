import { Card } from "@/components/UI/Card";
import ParallaxScrollView from "@/components/UI/Layout/ParallaxScrollView";
import { Text } from "@/components/UI/Text";
import { data } from "@/constants/constants";
import { useTheme } from "@/contexts/ThemeContext";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { AnimatedBarChart } from "../../components/UI/Charts/AnimatedBarChart";

interface TodayWorkout {
  id: string;
  name: string;
  workout_id: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [todayWorkout, setTodayWorkout] = useState<TodayWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let todayString = today.toLocaleDateString("pt-BR", options);
  todayString = todayString.charAt(0).toUpperCase() + todayString.slice(1);

  const fetchTodayWorkout = async () => {
    try {
      const response = await api.get<TodayWorkout>("/workouts/today");
      setTodayWorkout(response.data);
    } catch (error) {
      console.error("Erro ao buscar treino de hoje:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayWorkout();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTodayWorkout();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderTodayWorkoutCard = () => {
    if (loading) {
      return (
        <Card
          variant="filled"
          borderRadius="large"
          padding="large"
          style={[styles.loadingCard, styles.todayWorkoutCard]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <View style={styles.skeletonText} />
              <View style={[styles.skeletonText, { width: "70%" }]} />
              <View style={[styles.skeletonText, { width: "50%" }]} />
            </View>
            <View style={styles.skeletonIcon} />
          </View>
        </Card>
      );
    }

    const hasWorkout = !!todayWorkout;
    const backgroundColor = hasWorkout
      ? theme.colors.primary[500]
      : theme.colors.text.disabled;

    const handlePress = () => {
      if (todayWorkout) {
        router.push(`/complete-workout/${todayWorkout.workout_id}`);
      } else {
        router.push("/workout");
      }
    };

    return (
      <Card
        variant="filled"
        borderRadius="large"
        padding="large"
        onPress={handlePress}
        style={[styles.todayWorkoutCard, { backgroundColor }]}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardTextContainer}>
            <View style={styles.cardHeader}>
              <Text
                variant="caption"
                style={[styles.cardLabel, { color: "white" }]}
              >
                {todayWorkout ? "TREINO DE HOJE" : "DIA DE DESCANSO"}
              </Text>
            </View>
            <Text variant="h2" style={[styles.cardTitle, { color: "white" }]}>
              {todayWorkout?.name || "Descanso Ativo"}
            </Text>
            <Text
              variant="caption"
              style={[styles.cardDescription, { color: "white" }]}
            >
              {todayWorkout
                ? "Toque para iniciar o treino"
                : "Aproveite para se recuperar!"}
            </Text>
          </View>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: hasWorkout
                  ? theme.colors.primary[600]
                  : theme.colors.text.secondary,
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
    );
  };

  const renderQuickAccessGrid = () => {
    const quickAccessItems = [
      {
        title: "Treinos",
        icon: "barbell-outline" as const,
        route: "/workout",
        color: theme.colors.primary[500],
        backgroundColor: `${theme.colors.primary[500]}20`,
      },
      {
        title: "Exercícios",
        icon: "list-outline" as const,
        route: "/exercises",
        color: theme.colors.info[500],
        backgroundColor: `${theme.colors.info[500]}20`,
      },
      {
        title: "Progresso",
        icon: "stats-chart-outline" as const,
        route: "/dashboard",
        color: theme.colors.success[500],
        backgroundColor: `${theme.colors.success[500]}20`,
      },
      {
        title: "Perfil",
        icon: "person-outline" as const,
        route: "/user-profile",
        color: theme.colors.warning[500],
        backgroundColor: `${theme.colors.warning[500]}20`,
      },
    ];

    return (
      <View style={styles.navGrid}>
        {quickAccessItems.map((item, index) => (
          <Card
            key={index}
            variant="elevated"
            borderRadius="medium"
            padding="medium"
            onPress={() => router.push(item.route as any)}
            style={styles.navCard}
          >
            <View style={styles.navContent}>
              <View
                style={[
                  styles.navIcon,
                  { backgroundColor: item.backgroundColor },
                ]}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text
                variant="body"
                style={[styles.navTitle, { color: item.color }]}
              >
                {item.title}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <ParallaxScrollView
      title="Hoje"
      subtitle={todayString}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary[500]]}
        />
      }
    >
      <View style={styles.section}>{renderTodayWorkoutCard()}</View>

      <View style={styles.section}>
        <Card variant="elevated" borderRadius="large" padding="large">
          <View style={styles.chartHeader}>
            <Text variant="h2" style={styles.sectionTitle}>
              Progresso Semanal
            </Text>
            <Pressable onPress={() => router.push("/dashboard")}>
              <Text
                variant="caption"
                style={[
                  styles.seeAllText,
                  { color: theme.colors.primary[500] },
                ]}
              >
                Ver detalhes
              </Text>
            </Pressable>
          </View>
          <View style={styles.chartContainer}>
            <AnimatedBarChart
              weeks={data}
              activeWeekIndex={activeWeekIndex}
              onWeekChange={setActiveWeekIndex}
            />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="h2" style={styles.sectionTitle}>
          Acesso Rápido
        </Text>
        {renderQuickAccessGrid()}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 16,
  },
  todayWorkoutCard: {
    borderWidth: 0,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    opacity: 0.9,
    fontSize: 12,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardDescription: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  statusText: {
    fontSize: 12,
  },
  loadingCard: {
    backgroundColor: "#f5f5f5",
  },
  skeletonText: {
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
  },
  navGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  navCard: {
    width: "48%",
    marginBottom: 12,
  },
  navContent: {
    alignItems: "center",
  },
  navIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  navTitle: {
    textAlign: "center",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  seeAllText: {
    fontFamily: "RobotoLight",
  },
});
