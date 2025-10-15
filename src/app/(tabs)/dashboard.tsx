import { Card } from "@/components/UI/Card";
import LineChart from "@/components/UI/Charts/AnimatedLineChart";
import AnimatedText from "@/components/UI/Charts/AnimatedLineChart/AnimatedText";
import ParallaxScrollView from "@/components/UI/Layout/ParallaxScrollView";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { data } from "@/data/data";
import { useFont } from "@shopify/react-native-skia";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export const DashboardScreen = () => {
  const { theme } = useTheme();

  const CHART_HEIGHT = 300;
  const CHART_MARGIN = 10;
  const { width: CHART_WIDTH } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState("Total");
  const selectedValue = useSharedValue(0);

  const font = useFont(require("@/assets/fonts/Teko/Teko-Regular.ttf"), 32);

  if (!font) {
    return null;
  }

  return (
    <ParallaxScrollView title="Dashboard" subtitle="Acompanhe sua evolução">
      <View style={styles.content}>
        <AnimatedText font={font} selectedValue={selectedValue} />
        <View style={styles.chartContainer}>
          {selectedDate === "Total" ? (
            <Text variant="h1">Volume {selectedDate}</Text>
          ) : (
            <Text variant="h1">Volume de {selectedDate}</Text>
          )}

          <LineChart
            data={data}
            chartHeight={CHART_HEIGHT}
            chartMargin={CHART_MARGIN}
            chartWidth={CHART_WIDTH}
            setSelectedDate={setSelectedDate}
            selectedValue={selectedValue}
          />
        </View>
        <View style={styles.statsGrid}>
          <Card
            variant="filled"
            borderRadius="medium"
            padding="medium"
            style={styles.statCard}
          >
            <Text
              variant="h3"
              style={[styles.statNumber, { color: theme.colors.primary[500] }]}
            >
              24
            </Text>
            <Text variant="caption" style={styles.statLabel}>
              Treinos Realizados
            </Text>
          </Card>

          <Card
            variant="filled"
            borderRadius="medium"
            padding="medium"
            style={styles.statCard}
          >
            <Text
              variant="h3"
              style={[styles.statNumber, { color: theme.colors.success[500] }]}
            >
              85%
            </Text>
            <Text variant="caption" style={styles.statLabel}>
              Taxa de Conclusão
            </Text>
          </Card>

          <Card
            variant="filled"
            borderRadius="medium"
            padding="medium"
            style={styles.statCard}
          >
            <Text
              variant="h3"
              style={[styles.statNumber, { color: theme.colors.info[500] }]}
            >
              12h
            </Text>
            <Text variant="caption" style={styles.statLabel}>
              Tempo Total
            </Text>
          </Card>

          <Card
            variant="filled"
            borderRadius="medium"
            padding="medium"
            style={styles.statCard}
          >
            <Text
              variant="h3"
              style={[styles.statNumber, { color: theme.colors.warning[500] }]}
            >
              1560
            </Text>
            <Text variant="caption" style={styles.statLabel}>
              Calorias Queimadas
            </Text>
          </Card>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  content: {},
  card: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    paddingTop: 10,
    marginBottom: 4,
  },
  statLabel: {
    textAlign: "center",
    opacity: 0.8,
  },
});

export default DashboardScreen;
