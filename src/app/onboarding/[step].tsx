// ============================================
// LIFTLOG - Onboarding Steps (Telas 2-4)
// ============================================

import { Text } from "@/components/UI/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { onboardingService } from "@/services/mockService";
import { OnboardingData, UserGoal, USER_GOAL_LABELS } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Onboarding steps configuration
const STEPS = {
  "1": {
    title: "Como te chamamos?",
    subtitle: "Seu nome ou apelido",
    type: "name" as const,
  },
  "2": {
    title: "Qual seu foco principal?",
    subtitle: "Personalizamos seus insights com base nisso",
    type: "goal" as const,
  },
  "3": {
    title: "Quantos dias por semana você treina?",
    subtitle: "Usamos isso para calcular suas metas",
    type: "frequency" as const,
  },
};

type StepKey = keyof typeof STEPS;

export default function OnboardingStep() {
  const router = useRouter();
  const { step } = useLocalSearchParams<{ step: StepKey }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { setHasCompletedOnboarding } = useAuth();

  const [data, setData] = useState<OnboardingData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = STEPS[step] || STEPS["1"];
  const stepNumber = parseInt(step) || 1;
  const totalSteps = Object.keys(STEPS).length;
  const progress = (stepNumber / totalSteps) * 100;

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (stepNumber < totalSteps) {
      router.push(`/onboarding/${stepNumber + 1}` as any);
    } else {
      // Final step - complete onboarding
      setIsSubmitting(true);
      try {
        await onboardingService.completeOnboarding(data);
        await setHasCompletedOnboarding(true);
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Error completing onboarding:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (stepNumber > 1) {
      router.back();
    } else {
      router.replace("/onboarding");
    }
  };

  const isNextDisabled = () => {
    switch (currentStep.type) {
      case "name":
        return !data.name || data.name.trim().length < 2;
      case "goal":
        return !data.goal;
      case "frequency":
        return !data.weeklyGoal;
      default:
        return false;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.primary,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        },
      ]}
    >
      {/* Header with progress */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </Pressable>

        <View style={styles.progressInfo}>
          <Text variant="caption" color="secondary">
            {stepNumber} de {totalSteps}
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.gray[200] }]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: theme.colors.primary[500],
            },
          ]}
        />
      </View>

      {/* Content */}
      <Animated.View
        key={step}
        entering={FadeInRight.duration(300)}
        style={styles.content}
      >
        <Text variant="h2" style={styles.title}>
          {currentStep.title}
        </Text>
        <Text variant="body" color="secondary" style={styles.subtitle}>
          {currentStep.subtitle}
        </Text>

        {/* Step-specific content */}
        <View style={styles.inputSection}>
          {currentStep.type === "name" && (
            <NameInput
              value={data.name || ""}
              onChange={(name) => setData({ ...data, name })}
              theme={theme}
            />
          )}

          {currentStep.type === "goal" && (
            <GoalSelector
              value={data.goal}
              onChange={(goal) => setData({ ...data, goal })}
              theme={theme}
            />
          )}

          {currentStep.type === "frequency" && (
            <FrequencySelector
              value={data.weeklyGoal}
              onChange={(weeklyGoal) => setData({ ...data, weeklyGoal })}
              theme={theme}
            />
          )}
        </View>
      </Animated.View>

      {/* Footer with CTA */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.nextButton,
            {
              backgroundColor: isNextDisabled()
                ? theme.colors.gray[300]
                : theme.colors.primary[500],
            },
          ]}
          onPress={handleNext}
          disabled={isNextDisabled() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text variant="button" color="inverse">
                {stepNumber === totalSteps ? "Finalizar" : "Continuar"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// ============================================
// Step Components
// ============================================

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  theme: any;
}

function NameInput({ value, onChange, theme }: NameInputProps) {
  return (
    <Animated.View entering={FadeInDown.delay(200)}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Seu nome"
        placeholderTextColor={theme.colors.text.placeholder}
        style={[
          styles.textInput,
          {
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            borderColor: value ? theme.colors.primary[500] : theme.colors.gray[300],
          },
        ]}
        autoFocus
        autoCapitalize="words"
      />
    </Animated.View>
  );
}

interface GoalSelectorProps {
  value?: UserGoal;
  onChange: (value: UserGoal) => void;
  theme: any;
}

const GOAL_OPTIONS: { value: UserGoal; emoji: string }[] = [
  { value: "hypertrophy", emoji: "💪" },
  { value: "strength", emoji: "🏋️" },
  { value: "weight_loss", emoji: "🔥" },
  { value: "health", emoji: "❤️" },
];

function GoalSelector({ value, onChange, theme }: GoalSelectorProps) {
  return (
    <View style={styles.optionsGrid}>
      {GOAL_OPTIONS.map((option, index) => (
        <Animated.View
          key={option.value}
          entering={FadeInDown.delay(100 * index)}
          style={{ width: "48%" }}
        >
          <Pressable
            style={[
              styles.optionCard,
              {
                backgroundColor:
                  value === option.value
                    ? theme.colors.primary[50]
                    : theme.colors.background.secondary,
                borderColor:
                  value === option.value
                    ? theme.colors.primary[500]
                    : theme.colors.gray[200],
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(option.value);
            }}
          >
            <Text style={styles.optionEmoji}>{option.emoji}</Text>
            <Text
              variant="bodyMedium"
              style={{
                color:
                  value === option.value
                    ? theme.colors.primary[700]
                    : theme.colors.text.primary,
              }}
            >
              {USER_GOAL_LABELS[option.value]}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}

interface FrequencySelectorProps {
  value?: number;
  onChange: (value: number) => void;
  theme: any;
}

const FREQUENCY_OPTIONS = [3, 4, 5, 6];

function FrequencySelector({ value, onChange, theme }: FrequencySelectorProps) {
  return (
    <View style={styles.frequencyContainer}>
      {FREQUENCY_OPTIONS.map((freq, index) => (
        <Animated.View key={freq} entering={FadeInDown.delay(100 * index)}>
          <Pressable
            style={[
              styles.frequencyOption,
              {
                backgroundColor:
                  value === freq
                    ? theme.colors.primary[500]
                    : theme.colors.background.secondary,
                borderColor:
                  value === freq
                    ? theme.colors.primary[500]
                    : theme.colors.gray[200],
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(freq);
            }}
          >
            <Text
              variant="h2"
              style={{
                color: value === freq ? "white" : theme.colors.text.primary,
              }}
            >
              {freq}
            </Text>
            <Text
              variant="small"
              style={{
                color: value === freq ? "rgba(255,255,255,0.8)" : theme.colors.text.secondary,
              }}
            >
              dias
            </Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  progressInfo: {
    alignItems: "center",
  },

  // Progress Bar
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 32,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },

  // Content
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  inputSection: {
    flex: 1,
  },

  // Name Input
  textInput: {
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    fontFamily: "RobotoRegular",
  },

  // Goal Selector
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  optionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  optionEmoji: {
    fontSize: 32,
  },

  // Frequency Selector
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  frequencyOption: {
    width: 72,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  // Footer
  footer: {
    paddingVertical: 16,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
});
