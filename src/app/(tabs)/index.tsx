import { AnimatedBarChart } from "@/components/AnimatedBarChart";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { data } from "@/constants/constants";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Card, Layout, Text, useTheme } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import "react-native-reanimated";

interface todayWorkout {
  id: string;
  name: string;
  workout_id: string;
}

export const getTodayWorkout = async (): Promise<todayWorkout[]> => {
  const response = await api.get("/today");
  console.log(response.data);
  return response.data;
};

export default function HomeScreen() {
  const router = useRouter();
  const [todayWorkout, setTodayWorkout] = useState<todayWorkout | null>(null);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const theme = useTheme();
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
        console.log(response.data);
        setTodayWorkout(response.data);
      } catch (error) {
        console.error("Erro ao buscar treino de hoje:", error);
      }
    };

    fetchTodayWorkout();
  }, []);

  return (
    <ParallaxScrollView title="Hoje" subtitle={todayString}>
      <Layout style={styles.container}>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Card
            onPress={() =>
              router.push(`/complete-workout/${todayWorkout?.workout_id}`)
            }
            style={[styles.card, { borderColor: theme["color-primary-500"] }]}
          >
            <View style={styles.cardContent}>
              <Text category="h4" style={{ fontFamily: "TekoRegular" }}>
                {todayWorkout?.name}
              </Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={32}
                color={theme["color-primary-500"]}
              />
            </View>
          </Card>
        </View>
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Pressable
            onPress={() => router.replace("/workout")}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text category="p1" style={{ fontFamily: "RobotoLight" }}>
              Meus treinos
            </Text>
          </Pressable>
        </View>
        <View style={{ marginTop: 40 }}>
          <AnimatedBarChart
            weeks={data}
            activeWeekIndex={activeWeekIndex}
            onWeekChange={setActiveWeekIndex}
          />
        </View>
      </Layout>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
