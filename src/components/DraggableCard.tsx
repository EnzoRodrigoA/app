import { Ionicons } from "@expo/vector-icons";
import { Card, Text, useTheme } from "@ui-kitten/components";
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
    shadowOffset: { width: 0, height: isActive ? 6 : 2 },
    shadowOpacity: isActive ? 0.25 : 0.12,
    shadowRadius: isActive ? 12 : 6,
    elevation: isActive ? 10 : 4,
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
  const theme = useTheme();

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle, ,]}>
      <Card
        style={[
          styles.card,
          isRest
            ? scheme === "dark"
              ? { backgroundColor: "transparent" }
              : { backgroundColor: "transparent" }
            : scheme === "dark"
            ? { backgroundColor: theme["background-basic-color-2"] }
            : { backgroundColor: theme["background-basic-color-2"] },
          { marginTop: 10, height: 80, justifyContent: "center" },
        ]}
        onPress={onPressDetails}
        disabled={!!isRest}
      >
        {isRest && (
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: 60,
              height: 2,
              width: "78%",
              backgroundColor: scheme === "dark" ? "#ffffff" : "#000",
              zIndex: 0,
            }}
          />
        )}
        <View style={styles.cardHeader}>
          <View style={styles.left}>
            {isEditingTitle ? null : onDelete && editMode && !isEditingTitle ? (
              <Pressable onPress={onDelete}>
                <Ionicons name="trash-outline" size={26} color={"#ff3b30"} />
              </Pressable>
            ) : !isRest && !isEditingTitle ? (
              <Ionicons name="barbell-outline" size={26} color={"#ff8800"} />
            ) : (
              <Ionicons
                name="bed-outline"
                size={28}
                color={scheme === "dark" ? "#ffffff" : "#000"}
              />
            )}
          </View>

          <View style={[styles.center, { alignItems: "center" }]}>
            {isRest ? (
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Text
                  category="h5"
                  style={[
                    styles.title,
                    {
                      textAlign: "center",
                      zIndex: 1,
                      backgroundColor: theme["background-basic-color-1"],
                      borderRadius: 20,
                      paddingHorizontal: 12,
                    },
                  ]}
                >
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
            {editMode && !isEditingTitle ? (
              <Pressable onLongPress={drag} delayLongPress={50}>
                <Ionicons
                  name="reorder-three-outline"
                  size={28}
                  color={"#0040ff"}
                />
              </Pressable>
            ) : (
              isRest && (
                <Ionicons
                  name="moon-outline"
                  size={26}
                  color={scheme === "dark" ? "#ffffff" : "#000"}
                />
              )
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
    elevation: 5,
    marginHorizontal: 16,
    marginTop: 10,
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
