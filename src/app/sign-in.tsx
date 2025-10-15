import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
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
  const { theme } = useTheme();
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
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Animated.View layout={LinearTransition.springify()}>
          <Text variant="h1" style={styles.title}>
            {isRegister ? "Criar conta" : "Login"}
          </Text>
        </Animated.View>

        {isRegister && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutDown.duration(300)}
            style={{ width: "100%" }}
          >
            <View style={styles.inputContainer}>
              <Text variant="body" style={styles.label}>
                Nome
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.background.primary,
                    borderColor: errors.username
                      ? theme.colors.error[500]
                      : theme.colors.background.tertiary,
                    color: theme.colors.text.primary,
                  },
                ]}
                placeholder="Nome de usuário"
                placeholderTextColor={theme.colors.text.secondary}
                value={username}
                onChangeText={setUsername}
                editable={!loading}
              />
              {errors.username && (
                <Text
                  variant="caption"
                  style={[styles.errorText, { color: theme.colors.error[500] }]}
                >
                  {errors.username}
                </Text>
              )}
            </View>
          </Animated.View>
        )}

        <View style={styles.inputContainer}>
          <Text variant="body" style={styles.label}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: errors.email
                  ? theme.colors.error[500]
                  : theme.colors.background.tertiary,
                color: theme.colors.text.primary,
              },
            ]}
            placeholder="Digite seu email"
            placeholderTextColor={theme.colors.text.secondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {errors.email && (
            <Text
              variant="caption"
              style={[styles.errorText, { color: theme.colors.error[500] }]}
            >
              {errors.email}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text variant="body" style={styles.label}>
            Senha
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: errors.password
                  ? theme.colors.error[500]
                  : theme.colors.background.tertiary,
                color: theme.colors.text.primary,
              },
            ]}
            placeholder="Digite sua senha"
            placeholderTextColor={theme.colors.text.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          {errors.password && (
            <Text
              variant="caption"
              style={[styles.errorText, { color: theme.colors.error[500] }]}
            >
              {errors.password}
            </Text>
          )}
        </View>

        {isRegister && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutDown.duration(300)}
            style={{ width: "100%" }}
          >
            <View style={styles.inputContainer}>
              <Text variant="body" style={styles.label}>
                Confirmar senha
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: errors.confirmPassword
                      ? theme.colors.error[500]
                      : theme.colors.background.tertiary,
                    color: theme.colors.text.primary,
                  },
                ]}
                placeholder="Repita a senha"
                placeholderTextColor={theme.colors.text.secondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
              {errors.confirmPassword && (
                <Text
                  variant="caption"
                  style={[styles.errorText, { color: theme.colors.error[500] }]}
                >
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </Animated.View>
        )}

        <Animated.View layout={LinearTransition.springify()}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary[500] },
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text variant="body" style={styles.buttonText}>
                {isRegister ? "Cadastrar" : "Entrar"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRegister((prev) => !prev)}
            disabled={loading}
          >
            <Text
              variant="caption"
              style={[
                styles.switchAuth,
                { color: theme.colors.text.secondary },
              ]}
            >
              {isRegister
                ? "Já tem uma conta? Faça login"
                : "Não tem uma conta? Cadastre-se"}
            </Text>
          </TouchableOpacity>
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
                    ? theme.colors.error[500]
                    : theme.colors.success[500],
              },
            ]}
          >
            <Text variant="body" style={styles.toastText}>
              {message.text}
            </Text>
          </Animated.View>
        )}
      </View>
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
    fontFamily: "TekoRegular",
  },
  inputContainer: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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
