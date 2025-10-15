import { HapticTab } from "@/components/haptic-tab";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { theme } = useTheme();

  const backgroundColor = theme.colors.background.primary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.text.secondary,
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
