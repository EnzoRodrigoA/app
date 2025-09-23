import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import { Button, Card, Text, useTheme } from "@ui-kitten/components";
import { FlatList, StyleSheet, View } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";

const tips = [
  { id: "1", title: "Hidrate-se antes do treino", emoji: "💧" },
  { id: "2", title: "Faça alongamento", emoji: "🧘‍♂️" },
  { id: "3", title: "Durma bem", emoji: "😴" },
];

const today = new Date();
const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
let todayString = today.toLocaleDateString("pt-BR", options);
todayString = todayString.charAt(0).toUpperCase() + todayString.slice(1);

export default function HomeScreen() {
  const theme = useTheme();

  const renderTip = ({ item }: any) => (
    <Card style={styles.tipCard} status="info">
      <Text category="s1">
        {item.emoji} {item.title}
      </Text>
    </Card>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "transparent", dark: "transparent" }}
    >
      <ThemedView style={styles.container}>
        <View style={styles.cardWrapper}>
          <Card
            appearance="outline"
            status="basic"
            style={[styles.card, { height: 300 }]}
          >
            <Text category="h6" appearance="hint">
              Treino de hoje
            </Text>
            <Button appearance="filled">Completar</Button>
          </Card>
        </View>

        {/* Progresso da semana */}
        <Text category="c1" appearance="hint" style={{ marginTop: 20 }}>
          Gráfico de cargas
        </Text>
        <Card style={styles.progressContainer} status="primary">
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "70%" }]} />
          </View>
          <Text category="s1" style={styles.progressText}>
            70% da meta atingida 💪
          </Text>
        </Card>

        {/* Dicas rápidas */}
        <Text category="h6" style={{ marginTop: 20 }}>
          Dicas rápidas
        </Text>
        <FlatList
          data={tips}
          keyExtractor={(item) => item.id}
          renderItem={renderTip}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        {/* Últimos treinos concluídos */}
        <Text category="h6" style={{ marginTop: 20 }}>
          Últimos treinos
        </Text>
        <Card style={{ marginTop: 10 }} status="basic">
          <Text category="s1">Treino de Peito - Concluído ✅</Text>
        </Card>
        <Card style={{ marginTop: 10 }} status="basic">
          <Text category="s1">Treino de Pernas - Concluído ✅</Text>
        </Card>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  cardWrapper: {
    borderRadius: 22,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16,
  },
  card: {
    overflow: "hidden",
    borderRadius: 20,
  },

  tipCard: {
    borderRadius: 10,
    marginRight: 15,
    width: 200,
  },
  progressContainer: {
    borderRadius: 10,
    height: 300,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#B2EBF2",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: 12,
    backgroundColor: "#00ACC1",
    borderRadius: 6,
  },
  progressText: {
    marginTop: 10,
    fontWeight: "600",
    color: "#007C91",
  },
});
