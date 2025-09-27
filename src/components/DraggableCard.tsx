import { Ionicons } from "@expo/vector-icons";
import { Card, Text } from "@ui-kitten/components";
import { ReactNode, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Button from "./Button";

interface DraggableCardProps {
  title: string;
  isRest?: boolean;
  children?: ReactNode;
  drag: () => void;
  isActive: boolean;
  editMode: boolean;
  onPressDetails?: () => void;
  onEditTitle?: (newTitle: string) => void;
  onDelete?: () => void;
  exercisesCount?: number; // ex: 6 exercícios
  intensity?: "Baixa" | "Média" | "Alta"; // badge de intensidade
}

export function DraggableCard({
  title,
  isRest,
  children,
  drag,
  isActive,
  editMode,
  onPressDetails,
  onEditTitle,
  onDelete,
  exercisesCount,
  intensity,
}: DraggableCardProps) {
  const scheme = useColorScheme();

  const [localTitle, setLocalTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(localTitle);

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isActive ? 1.05 : 1) },
      { translateX: translateX.value },
    ],
    shadowOpacity: isActive ? 0.25 : 0.1,
    shadowRadius: isActive ? 14 : 8,
    elevation: isActive ? 12 : 5,
  }));

  useEffect(() => {
    setLocalTitle(title);
    setEditingTitle(title);
  }, [title]);

  const handleSaveTitle = () => {
    setLocalTitle(editingTitle);
    onEditTitle?.(editingTitle);
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setEditingTitle(localTitle);
    setIsEditingTitle(false);
  };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Card
        style={[
          styles.card,
          isRest
            ? scheme === "dark"
              ? { backgroundColor: "rgba(165, 80, 255, 0.15)" }
              : { backgroundColor: "rgba(111, 0, 255, 0.05)" }
            : scheme === "dark"
            ? { backgroundColor: "rgba(255, 185, 80, 0.1)" }
            : { backgroundColor: "rgba(255, 162, 0, 0.05)" },
        ]}
        onPress={onPressDetails}
        disabled={!!isRest}
      >
        <View style={styles.cardHeader}>
          <View style={styles.left}>
            {isEditingTitle ? null : onDelete && editMode && !isEditingTitle ? (
              <Pressable onPress={onDelete}>
                <Ionicons name="trash-outline" size={26} color={"#ff3b30"} />
              </Pressable>
            ) : !isRest && !isEditingTitle ? (
              <Ionicons name="barbell-outline" size={26} color={"#ff8800"} />
            ) : (
              <Ionicons name="moon-outline" size={26} color={"#4400ff"} />
            )}
          </View>

          <View style={[styles.center, { alignItems: "center" }]}>
            {isRest ? (
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Text category="h5" style={styles.title}>
                  Dia de descanso
                </Text>
              </View>
            ) : isEditingTitle ? (
              <>
                <TextInput
                  value={editingTitle}
                  onChangeText={setEditingTitle}
                  placeholder="Nome do treino"
                  style={[
                    styles.input,
                    { color: scheme === "dark" ? "#fff" : "#000" },
                  ]}
                  autoFocus
                />
                <View style={styles.editButtons}>
                  <Button
                    text="Cancelar"
                    onPress={handleCancelEdit}
                    type="secondary"
                    style={styles.button}
                  />
                  <Button
                    text="Salvar"
                    onPress={handleSaveTitle}
                    type="primary"
                    style={styles.button}
                  />
                </View>
              </>
            ) : editMode ? (
              <Pressable onPress={() => setIsEditingTitle(true)}>
                <Text category="h5" style={styles.title}>
                  {localTitle}
                </Text>
              </Pressable>
            ) : (
              <>
                <Text category="h5" style={styles.title}>
                  {localTitle}
                </Text>

                <View style={styles.subInfo}>
                  {exercisesCount && (
                    <Text appearance="hint" category="s2">
                      📋 {exercisesCount} exercícios
                    </Text>
                  )}
                  {intensity && (
                    <View
                      style={[
                        styles.badge,
                        intensity === "Alta"
                          ? { backgroundColor: "#ff5252" }
                          : intensity === "Média"
                          ? { backgroundColor: "#ff9800" }
                          : { backgroundColor: "#4caf50" },
                      ]}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {intensity}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>

          <View style={styles.right}>
            {editMode && !isEditingTitle && (
              <Pressable onLongPress={drag} delayLongPress={50}>
                <Ionicons
                  name="reorder-three-outline"
                  size={28}
                  color={"#0040ff"}
                />
              </Pressable>
            )}
          </View>
        </View>

        {!isRest && children}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 16,
    marginHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  left: {
    alignItems: "flex-start",
    width: 32,
  },
  center: {
    flex: 1,
  },
  right: {
    alignItems: "flex-end",
    width: 32,
  },
  button: {
    width: 110,
  },
  editButtons: {
    flexDirection: "row",
    marginTop: 4,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  input: {
    fontFamily: "TekoRegular",
    fontSize: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 2,
  },
  title: {
    fontFamily: "TekoRegular",
  },
  subInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
});
