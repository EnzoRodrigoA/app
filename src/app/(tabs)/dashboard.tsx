import { Card } from "@/components/UI/Card"
import LineChart from "@/components/UI/Charts/AnimatedLineChart"
import AnimatedText from "@/components/UI/Charts/AnimatedLineChart/AnimatedText"
import ParallaxScrollView from "@/components/UI/Layout/ParallaxScrollView"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { data } from "@/data/data"
import { Ionicons } from "@expo/vector-icons"
import { useFont } from "@shopify/react-native-skia"
import { useState } from "react"
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native"
import Animated, { FadeInDown, useSharedValue } from "react-native-reanimated"

type Period = "Semana" | "Mês" | "Ano"

export const DashboardScreen = () => {
  const { theme } = useTheme()

  const CHART_HEIGHT = 300
  const CHART_MARGIN = 10
  const { width: CHART_WIDTH } = useWindowDimensions()
  const [selectedDate, setSelectedDate] = useState("Total")
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Semana")
  const selectedValue = useSharedValue(0)

  const font = useFont(require("@/assets/fonts/Teko/Teko-Regular.ttf"), 32)

  if (!font) {
    return null
  }

  return (
    <ParallaxScrollView title="Dashboard" subtitle="Acompanhe sua evolução">
      <View style={styles.content}>
        {/* Period Selector */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <View style={styles.periodSelector}>
            {(["Semana", "Mês", "Ano"] as Period[]).map((period) => (
              <Pressable
                key={period}
                onPress={() => setSelectedPeriod(period)}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor:
                      selectedPeriod === period
                        ? theme.colors.primary[500]
                        : theme.colors.background.secondary,
                    borderWidth: selectedPeriod === period ? 0 : 1,
                    borderColor: theme.colors.gray[200]
                  }
                ]}
              >
                <Text
                  variant="caption"
                  style={{
                    color:
                      selectedPeriod === period
                        ? theme.colors.text.inverse
                        : theme.colors.text.secondary,
                    fontWeight: selectedPeriod === period ? "600" : "500"
                  }}
                >
                  {period}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Animated Value Display */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <AnimatedText font={font} selectedValue={selectedValue} />
        </Animated.View>

        {/* Chart Container */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.chartContainer}>
          {selectedDate === "Total" ? (
            <Text variant="h1" style={styles.chartTitle}>
              Volume {selectedDate}
            </Text>
          ) : (
            <Text variant="h1" style={styles.chartTitle}>
              Volume de {selectedDate}
            </Text>
          )}

          <LineChart
            data={data}
            chartHeight={CHART_HEIGHT}
            chartMargin={CHART_MARGIN}
            chartWidth={CHART_WIDTH}
            setSelectedDate={setSelectedDate}
            selectedValue={selectedValue}
          />
        </Animated.View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.colors.gray[100] }]} />

        {/* Stats Section Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)}>
          <Text variant="h2" style={styles.statsTitle}>
            Estatísticas
          </Text>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.statsGrid}>
          <Card
            variant="filled"
            borderRadius="medium"
            padding="medium"
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.primary[50],
                borderWidth: 1,
                borderColor: theme.colors.primary[100]
              }
            ]}
          >
            <View
              style={[styles.statIconContainer, { backgroundColor: theme.colors.primary[500] }]}
            >
              <Ionicons name="barbell-outline" size={24} color={theme.colors.text.inverse} />
            </View>
            <Text variant="h2" style={[styles.statNumber, { color: theme.colors.primary[500] }]}>
              24
            </Text>
            <Text
              variant="caption"
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Treinos
            </Text>
          </Card>

          <Card
            variant="filled"
            borderRadius="medium"
            padding="medium"
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.success[50],
                borderWidth: 1,
                borderColor: theme.colors.success[100]
              }
            ]}
          >
            <View
              style={[styles.statIconContainer, { backgroundColor: theme.colors.success[500] }]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={theme.colors.text.inverse}
              />
            </View>
            <Text variant="h2" style={[styles.statNumber, { color: theme.colors.success[500] }]}>
              85%
            </Text>
            <Text
              variant="caption"
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Conclusão
            </Text>
          </Card>

          <Card
            variant="filled"
            borderRadius="medium"
            padding="medium"
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.info[50],
                borderWidth: 1,
                borderColor: theme.colors.info[100]
              }
            ]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: theme.colors.info[500] }]}>
              <Ionicons name="time-outline" size={24} color={theme.colors.text.inverse} />
            </View>
            <Text variant="h2" style={[styles.statNumber, { color: theme.colors.info[500] }]}>
              12h
            </Text>
            <Text
              variant="caption"
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Tempo Total
            </Text>
          </Card>

          <Card
            variant="filled"
            borderRadius="medium"
            padding="medium"
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.warning[50],
                borderWidth: 1,
                borderColor: theme.colors.warning[100]
              }
            ]}
          >
            <View
              style={[styles.statIconContainer, { backgroundColor: theme.colors.warning[500] }]}
            >
              <Ionicons name="flame-outline" size={24} color={theme.colors.text.inverse} />
            </View>
            <Text variant="h2" style={[styles.statNumber, { color: theme.colors.warning[500] }]}>
              1560
            </Text>
            <Text
              variant="caption"
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Calorias
            </Text>
          </Card>
        </Animated.View>
      </View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40
  },
  periodSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 0
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  chartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
    width: "100%"
  },
  chartTitle: {
    marginBottom: 20
  },
  divider: {
    height: 1,
    marginVertical: 32
  },
  statsTitle: {
    marginBottom: 16,
    fontFamily: "TekoRegular"
  },
  card: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12
  },
  statCard: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12
  },
  statNumber: {
    fontSize: 28,
    marginBottom: 4,
    fontFamily: "TekoRegular"
  },
  statLabel: {
    textAlign: "center",
    opacity: 0.8,
    fontSize: 12
  }
})

export default DashboardScreen
