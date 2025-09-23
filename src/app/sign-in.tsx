import { Button, Input, Layout, Text, useTheme } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  LinearTransition,
} from "react-native-reanimated";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const theme = useTheme();
  const router = useRouter();
  const [message, setMessage] = useState<{
    text: string;
    status: "success" | "danger";
  } | null>(null);
  const timeoutRef = useRef<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { login, register, setHasCompletedOnboarding } = useAuth();

  function showMessage(
    text: string,
    status: "success" | "danger",
    duration = 3000
  ) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage({ text, status });
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, duration);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleSubmit() {
    const isValid = validateForm(isRegister);
    if (!isValid) return;

    setLoading(true);
    try {
      if (isRegister) {
        const request = await register(username, email, password);
        if (!request.success) {
          showMessage(request.message || "Erro no cadastro", "danger");
          return;
        }
        showMessage("Cadastro realizado com sucesso!", "success");
        const loginResponse = await login(email, password);
        if (!loginResponse.success) {
          showMessage(loginResponse.message || "Erro ao fazer login", "danger");
          return;
        } else {
          setHasCompletedOnboarding(false);
          router.replace("/onboarding");
        }
      } else {
        const request = await login(email, password);
        if (!request.success) {
          showMessage(request.message || "Erro ao fazer login", "danger");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function validateForm(isRegister: boolean) {
    const newErrors: { [key: string]: string } = {};

    if (isRegister && !username.trim()) {
      newErrors.username = "Nome é obrigatório";
    }

    if (!email.includes("@")) {
      newErrors.email = "Email inválido";
    }

    if (isRegister && password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!isRegister && password.length < 6) {
      newErrors.password = "Senha incorreta";
    }

    if (isRegister && password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Layout style={styles.container}>
        <Animated.View layout={LinearTransition.springify()}>
          <Text category="h1" style={styles.title}>
            {isRegister ? "Criar conta" : "Login"}
          </Text>
        </Animated.View>

        {isRegister && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutDown.duration(300)}
            style={{ width: "100%" }}
          >
            <Input
              style={styles.input}
              label="Nome"
              placeholder="Nome de usuário"
              value={username}
              onChangeText={setUsername}
              caption={errors.username}
              status={errors.username ? "danger" : "basic"}
              disabled={loading ? true : false}
            />
          </Animated.View>
        )}

        <Input
          style={styles.input}
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          caption={errors.email}
          status={errors.email ? "danger" : "basic"}
          disabled={loading ? true : false}
        />

        <Input
          style={styles.input}
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          caption={errors.password}
          status={errors.password ? "danger" : "basic"}
          disabled={loading ? true : false}
        />

        {isRegister && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutDown.duration(300)}
            style={{ width: "100%" }}
          >
            <Input
              style={styles.input}
              label="Confirmar senha"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              caption={errors.confirmPassword}
              status={errors.confirmPassword ? "danger" : "basic"}
              disabled={loading ? true : false}
            />
          </Animated.View>
        )}
        <Animated.View layout={LinearTransition.springify()}>
          <Button
            style={styles.button}
            size="medium"
            onPress={handleSubmit}
            accessoryLeft={
              loading
                ? () => <ActivityIndicator size="small" color="#fff" />
                : undefined
            }
          >
            {!loading && (isRegister ? "Cadastrar" : "Entrar")}
          </Button>

          <Text
            appearance="hint"
            style={styles.switchAuth}
            onPress={() => setIsRegister((prev) => !prev)}
            disabled={loading ? true : false}
          >
            {isRegister
              ? "Já tem uma conta? Faça login"
              : "Não tem uma conta? Cadastre-se"}
          </Text>
        </Animated.View>

        {message && (
          <Animated.View
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(250)}
            style={[
              styles.toast,
              {
                backgroundColor:
                  message.status === "danger"
                    ? theme["color-danger-600"]
                    : theme["color-success-600"],
              },
            ]}
          >
            <Text style={styles.toastText}>{message.text}</Text>
          </Animated.View>
        )}
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 24,
  },
  switchAuth: {
    textAlign: "center",
    marginTop: 16,
  },
  toast: {
    position: "absolute",
    bottom: 60,
    left: 24,
    right: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
