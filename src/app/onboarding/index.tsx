// ============================================
// LIFTLOG - Onboarding Welcome Screen (Tela 1)
// ============================================

import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingWelcome() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/onboarding/1");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.primary,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
        },
      ]}
    >
      {/* Hero Section */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.heroEmoji}>🏋️</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <Text variant="h1" style={styles.title}>
            Seu treino em{"\n"}
            <Text variant="h1" style={{ color: theme.colors.primary[500] }}>
              2 toques.
            </Text>
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)}>
          <Text variant="body" color="secondary" style={styles.subtitle}>
            Registre séries sem fricção.{"\n"}
            Visualize seus ganhos.
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Features Preview */}
      <Animated.View entering={FadeInUp.delay(800)} style={styles.featuresSection}>
        <FeatureItem
          icon="flash-outline"
          title="Log Ultrarrápido"
          description="Um toque para repetir sua última série"
          color={theme.colors.primary[500]}
        />
        <FeatureItem
          icon="flame-outline"
          title="Streaks"
          description="Mantenha a consistência com recompensas"
          color={theme.colors.warning[500]}
        />
        <FeatureItem
          icon="trending-up-outline"
          title="Insights"
          description="Veja seu progresso em tempo real"
          color={theme.colors.success[500]}
        />
      </Animated.View>

      {/* CTA Button */}
      <Animated.View entering={FadeInUp.delay(1000)} style={styles.ctaSection}>
        <Pressable
          style={[styles.ctaButton, { backgroundColor: theme.colors.primary[500] }]}
          onPress={handleStart}
        >
          <Text variant="button" color="inverse">
            Começar
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>

        <Text variant="small" color="secondary" style={styles.ctaSubtext}>
          Leva menos de 1 minuto
        </Text>
      </Animated.View>
    </View>
  );
}

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

function FeatureItem({ icon, title, description, color }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.featureText}>
        <Text variant="bodyMedium">{title}</Text>
        <Text variant="caption" color="secondary">
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },

  // Hero
  heroSection: {
    alignItems: "center",
    marginTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    lineHeight: 44,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },

  // Features
  featuresSection: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    flex: 1,
    gap: 2,
  },

  // CTA
  ctaSection: {
    alignItems: "center",
    gap: 12,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaSubtext: {
    textAlign: "center",
  },
});
