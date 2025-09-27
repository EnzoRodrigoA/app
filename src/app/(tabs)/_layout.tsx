import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@ui-kitten/components";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const backgroundColor = colorScheme === "dark" ? "#010101" : "#fff";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme["color-primary-500"],
        tabBarInactiveTintColor: theme["text-hint-color"],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 80,
          borderTopWidth: 0,
          paddingTop: 0,

          backgroundColor: backgroundColor,
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
        name="dashboard"
        options={{
          title: "Painel",
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
