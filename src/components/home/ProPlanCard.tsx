import Button from "@/components/UI/Button"
import { Card } from "@/components/UI/Card"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { Image, StyleSheet, View } from "react-native"

export function ProPlanCard() {
  const { theme } = useTheme()

  const handleUpgradePress = () => {
    // TODO: Navigate to pro plan subscription screen
    console.log("Upgrade to Pro")
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <Image
            source={require("../../assets/images/pro-plan-icon.png")}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text variant="h2" style={[styles.title, { color: theme.colors.text.primary }]}>
              Desbloqueia Plano Pro
            </Text>

            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
              Acesso a relatórios avançados, análise de progresso e muito mais
            </Text>
          </View>

          <Button
            title="Assinar Agora"
            type="primary"
            style={styles.button}
            onPress={handleUpgradePress}
          />
        </View>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 20,
    marginBottom: 40
  },
  card: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center"
  },
  content: {
    alignItems: "center",
    width: "100%"
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 16
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 16
  },
  title: {
    fontFamily: "TekoRegular",
    marginBottom: 8,
    textAlign: "center"
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
  button: {
    width: "100%"
  }
})
