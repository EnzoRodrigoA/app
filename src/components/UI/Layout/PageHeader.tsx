import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { Text } from "../Text";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export const PageHeader = ({
  title,
  showBackButton = true,
}: PageHeaderProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {showBackButton && (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 50,
    justifyContent: "space-between",
  },

  backButton: {
    marginRight: 12,
  },
  title: {
    fontFamily: "TekoRegular",
    paddingTop: 10,
    fontSize: 28,
  },
});
