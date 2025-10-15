import { useTheme } from "@/contexts/ThemeContext";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "../Text";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
}

export const LoadingState = ({
  message = "Carregando...",
  size = "large",
}: LoadingStateProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.theme.colors.primary[500]} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  message: {
    marginTop: 12,
    fontFamily: "RobotoLight",
  },
});
