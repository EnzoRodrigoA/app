import { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedInput } from "../components/themed-input";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { ThemedPressable } from "../components/thmed-pressable";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();

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
    <ThemedView style={styles.Container}>
      <ThemedText type="title">
        {isRegister ? "Criar conta" : "Login"}{" "}
      </ThemedText>

      {isRegister && (
        <ThemedInput
          label="Nome"
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          style={{ width: 300 }}
          error={errors.username}
        />
      )}

      <ThemedInput
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ width: 300 }}
        error={errors.email}
      />
      <ThemedInput
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ width: 300 }}
        error={errors.password}
      />
      {isRegister && (
        <ThemedInput
          label="Senha"
          placeholder="Confirmar senha"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          style={{ width: 300 }}
          error={errors.confirmPassword}
        />
      )}
      <ThemedPressable
        onPress={async () => {
          if (!validateForm(isRegister)) return;

          setLoading(true);
          try {
            if (isRegister) {
              await register(username, email, password);
            } else {
              await login(email, password);
            }
          } finally {
            setLoading(false);
          }
        }}
        style={{ marginTop: 20 }}
        title={
          loading ? (
            <ActivityIndicator testID="loading-indicator" color="#fff" />
          ) : isRegister ? (
            "Cadastrar"
          ) : (
            "Entrar"
          )
        }
      />

      <ThemedText
        type="default"
        style={{ marginTop: 20, textAlign: "center" }}
        onPress={() => setIsRegister((prev) => !prev)}
      >
        {isRegister
          ? "Já tem uma conta? Faça login"
          : "Não tem uma conta? Cadastre-se"}
      </ThemedText>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
