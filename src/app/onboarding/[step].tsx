import { QuestionField } from "@/components/QuestionField";
import { Skeleton } from "@/components/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import api from "@/services/api";
import { Question } from "@/types/QuestionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Divider,
  Layout,
  ProgressBar,
  Text,
} from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function OnboardingStep() {
  const router = useRouter();
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
        <Layout style={styles.container}>
          {questions.length ? (
            <>
              <Text category="s1" appearance="hint" style={styles.headerText}>
                {`Pergunta ${currentStep + 1} de ${questions.length}`}
              </Text>
              <ProgressBar
                progress={(currentStep + 1) / questions.length}
                style={styles.progressBar}
              />
              <Divider style={styles.divider} />

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

              <Button
                onPress={handleNext}
                style={styles.button}
                status={
                  currentStep + 1 < questions.length ? "primary" : "success"
                }
                accessoryRight={
                  isSubmitting
                    ? () => <ActivityIndicator color="#fff" />
                    : undefined
                }
              >
                {currentStep + 1 < questions.length ? "Próxima" : "Finalizar"}
              </Button>
            </>
          ) : (
            <Layout style={styles.skeletonContainer}>
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
            </Layout>
          )}
        </Layout>
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
  progressBar: {
    marginBottom: 16,
    height: 8,
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
  },
  divider: {
    marginBottom: 24,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    marginTop: 24,
  },
  skeletonContainer: {
    flex: 1,
    justifyContent: "center", // centraliza verticalmente
    paddingHorizontal: 12,
  },
});
