import { QuestionField } from "@/components/QuestionField";
import { Skeleton } from "@/components/UI/Feedback/Skeleton";
import { Text } from "@/components/UI/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useTheme } from "@/contexts/ThemeContext";
import api from "@/services/api";
import { Question } from "@/types/QuestionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function OnboardingStep() {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const { answers, updateAnswer } = useOnboarding();
  const [questions, setQuestions] = useState<Question[]>([]);
  const { setHasCompletedOnboarding } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<Question[]>("/questions")
      .then((response) => setQuestions(response.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("onboardingAnswers", JSON.stringify(answers));
    AsyncStorage.setItem("onboardingStep", currentStep.toString());
  }, [answers, currentStep]);

  useEffect(() => {
    async function restoreProgress() {
      const storedAnswers = await AsyncStorage.getItem("onboardingAnswers");
      const storedStep = await AsyncStorage.getItem("onboardingStep");

      if (storedAnswers) {
        const parsed = JSON.parse(storedAnswers);
        Object.entries(parsed).forEach(([id, value]) =>
          updateAnswer(id, value)
        );
      }

      if (storedStep) {
        setCurrentStep(Number(storedStep));
      }
    }

    restoreProgress();
  }, [questions, updateAnswer]);

  const question = questions[currentStep];

  const handleNext = async () => {
    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      try {
        await api.post("/user-settings", { ...answers });
        await AsyncStorage.setItem("hasCompletedOnboarding", "true");
        setHasCompletedOnboarding(true);
        router.replace("/(tabs)");
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          {questions.length ? (
            <>
              <Text
                variant="caption"
                style={[
                  styles.headerText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {`Pergunta ${currentStep + 1} de ${questions.length}`}
              </Text>

              {/* Progress Bar Customizada */}
              <View
                style={[
                  styles.progressBarContainer,
                  { backgroundColor: theme.colors.background.tertiary },
                ]}
              >
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${((currentStep + 1) / questions.length) * 100}%`,
                      backgroundColor: theme.colors.primary[500],
                    },
                  ]}
                />
              </View>

              {/* Divider Customizado */}
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.background.tertiary },
                ]}
              />

              <Animated.View
                key={currentStep}
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                style={styles.questionContainer}
              >
                <QuestionField
                  question={question}
                  value={answers[question.id]}
                  onChange={updateAnswer}
                />
              </Animated.View>

              {/* Botão Próxima/Finalizar */}
              <TouchableOpacity
                onPress={handleNext}
                disabled={isSubmitting}
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      currentStep + 1 < questions.length
                        ? theme.colors.primary[500]
                        : theme.colors.success,
                  },
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text variant="body" style={styles.buttonText}>
                    {currentStep + 1 < questions.length
                      ? "Próxima"
                      : "Finalizar"}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Botão Voltar */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.outlineButton,
                  {
                    opacity: currentStep > 0 ? 1 : 0,
                    borderColor: theme.colors.primary[500],
                  },
                ]}
                onPress={async () => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                  } else {
                    router.replace("/(tabs)");
                  }
                }}
              >
                <Text
                  variant="body"
                  style={[
                    styles.outlineButtonText,
                    { color: theme.colors.primary[500] },
                  ]}
                >
                  Voltar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.skeletonContainer}>
              <Skeleton
                style={{
                  width: "60%",
                  height: 24,
                  marginBottom: 16,
                }}
              />
              <Skeleton
                style={{ width: "100%", height: 48, marginBottom: 12 }}
              />
              <Skeleton style={{ width: "100%", height: 48 }} />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  progressBarContainer: {
    marginBottom: 16,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "RobotoLight",
  },
  divider: {
    marginBottom: 24,
    height: 1,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  outlineButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  skeletonContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});
