// components/lists/ExpandableCard.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutRight,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Text } from "../Text";

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const ExpandableCard = ({
  title,
  subtitle,
  children,
  isExpanded = false,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}: ExpandableCardProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(isExpanded);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(expanded ? "auto" : 0, { duration: 300 }),
      opacity: withTiming(expanded ? 1 : 0, { duration: 300 }),
    };
  });

  const handlePress = () => {
    setExpanded(!expanded);
    onPress?.();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100)}
      exiting={FadeOutRight.delay(200)}
      style={[
        styles.card,
        { backgroundColor: theme.theme.colors.background.card },
      ]}
    >
      <Pressable onPress={handlePress} style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="h4" style={styles.title}>
            {title}
          </Text>
          {subtitle && <Text variant="small">{subtitle}</Text>}
        </View>
        <View style={styles.headerActions}>
          {showActions && (
            <>
              {onEdit && (
                <Pressable onPress={onEdit} style={styles.actionButton}>
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={theme.theme.colors.primary[500]}
                  />
                </Pressable>
              )}
              {onDelete && (
                <Pressable onPress={onDelete} style={styles.actionButton}>
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={theme.theme.colors.error[500]}
                  />
                </Pressable>
              )}
            </>
          )}
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.theme.colors.primary[600]}
          />
        </View>
      </Pressable>

      <Animated.View style={[styles.content, animatedStyle]}>
        {children}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontFamily: "TekoRegular",
    fontSize: 20,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  content: {
    overflow: "hidden",
    marginTop: 12,
  },
});
