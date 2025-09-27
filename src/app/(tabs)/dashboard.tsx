import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Card, Layout, Text } from "@ui-kitten/components";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface Workout {
  id: number;
  title: string;
  exercises: number;
  duration: string;
  icon: string;
}
const workouts: Workout[] = [
  {
    id: 1,
    title: "Peito e Tríceps",
    exercises: 6,
    duration: "45 min",
    icon: "fitness",
  },
  {
    id: 2,
    title: "Costas e Bíceps",
    exercises: 5,
    duration: "50 min",
    icon: "barbell",
  },
  {
    id: 3,
    title: "Perna Completa",
    exercises: 7,
    duration: "60 min",
    icon: "flash",
  },
];

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      title="Treinos"
      subtitle="Aqui você pode acompanhar seus treinos diários"
    >
      {workouts.map((workout) => (
        <View key={workout.id} style={styles.cardWrapper}>
          <Card status="primary" style={styles.card}>
            <Layout style={styles.cardHeader}>
              <Text category="h4" style={styles.cardTitle}>
                {workout.title}
              </Text>
            </Layout>
            <Text category="p1" style={styles.cardInfo}>
              {workout.exercises} exercícios · {workout.duration}
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Ver detalhes</Text>
            </TouchableOpacity>
          </Card>
        </View>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginTop: 16,
    backgroundColor: "transparent",
  },
  title: {
    fontFamily: "TekoRegular",
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 16,
    opacity: 0.7,
    fontFamily: "RobotoLight",
  },
  cardWrapper: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  cardTitle: {
    fontFamily: "TekoRegular",
  },
  cardInfo: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    fontFamily: "RobotoLight",
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#4ade80",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontFamily: "RobotoLight",
  },
});
