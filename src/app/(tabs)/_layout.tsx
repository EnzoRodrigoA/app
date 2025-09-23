import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@ui-kitten/components";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const backgroundColor = colorScheme === "dark" ? "#000000dd" : "#ffffffcb";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme["color-primary-500"],
        tabBarInactiveTintColor: theme["text-hint-color"],
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          bottom: 16,
          height: 60,
          borderTopWidth: 0, // sem linha padrão
          marginHorizontal: 20,
          paddingTop: 10,
          backgroundColor: backgroundColor, // cor do tema
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 10,
          elevation: 5, // sombra no Android
          borderRadius: 100, // borda arredondada
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Treinos",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="barbell-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user-profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
