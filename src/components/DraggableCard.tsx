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
import { Expandable } from "./Expandable";

interface DraggableCardProps {
  title: string;
  isRest?: boolean;
  children?: ReactNode;
  drag: () => void;
  isActive: boolean;
  editMode: boolean;
  isExpanded?: boolean;
  isExercise?: boolean;
  onPressDetails?: () => void;
  onEditTitle?: (newTitle: string) => void;
  onDelete?: () => void;
  exercisesCount?: number;
  intensity?: "Baixa" | "Média" | "Alta";
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
  isExercise = false,
  isExpanded = false,
}: DraggableCardProps) {
  const scheme = useColorScheme();
  const theme = useTheme();

  const [localTitle, setLocalTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(localTitle);
  const [expanded, setExpanded] = useState(false);

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isActive ? 1.05 : 1) },
      { translateX: translateX.value },
    ],
    shadowOffset: { width: 0, height: isActive ? 6 : 2 },
    shadowOpacity: isRest ? 0 : isActive ? 0.25 : 0.12,
    shadowRadius: isRest ? 0 : isActive ? 12 : 6,
    elevation: isRest ? 0 : isActive ? 10 : 4,
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

  if (isRest) {
    return (
      <Animated.View style={[styles.cardWrapper, animatedStyle]}>
        <Pressable
          onLongPress={drag}
          delayLongPress={50}
          disabled={editMode ? false : true}
        >
          <View
            style={[
              styles.restContainer,
              {
                backgroundColor:
                  scheme === "dark"
                    ? "transparent"
                    : theme["background-basic-color-1"],
              },
            ]}
          >
            <View style={styles.left}>
              {editMode && onDelete ? (
                <Pressable onPress={onDelete}>
                  <Ionicons name="trash-outline" size={24} color={"#ff3b30"} />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.restCenter}>
              <View
                style={[
                  styles.restLine,
                  {
                    backgroundColor: scheme === "dark" ? "#fff" : "#000",
                    opacity: 0.12,
                  },
                ]}
              />
              <Text
                category="h5"
                style={[
                  styles.restTitle,
                  { backgroundColor: theme["background-basic-color-1"] },
                ]}
              >
                {localTitle || "Dia de descanso"}
              </Text>
            </View>

            <View style={styles.right}>
              {editMode && (
                <Ionicons
                  name="reorder-three-outline"
                  size={28}
                  color={theme["color-secondary-500"]}
                />
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Card
        style={[
          styles.card,
          scheme === "dark"
            ? { backgroundColor: theme["background-basic-color-2"] }
            : { backgroundColor: theme["background-basic-color-2"] },
        ]}
        onPress={() => {
          onPressDetails?.();
          setExpanded(!expanded);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.left}>
            {isEditingTitle ? null : onDelete && editMode ? (
              <Pressable onPress={onDelete}>
                <Ionicons name="trash-outline" size={26} color={"#ff3b30"} />
              </Pressable>
            ) : (
              <Ionicons
                name="barbell-outline"
                size={26}
                color={theme["color-primary-500"]}
              />
            )}
          </View>

          <View style={[styles.center]}>
            {isEditingTitle && editMode ? (
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
                    content={<Text>Cancelar</Text>}
                    onPress={handleCancelEdit}
                    type="secondary"
                    style={styles.button}
                  />
                  <Button
                    content={<Text>Salvar</Text>}
                    onPress={handleSaveTitle}
                    type="primary"
                    style={styles.button}
                  />
                </View>
              </>
            ) : (
              <>
                <Pressable onPress={() => editMode && setIsEditingTitle(true)}>
                  <Text category="h4" style={styles.title}>
                    {localTitle}
                  </Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.right}>
            {editMode && !isEditingTitle ? (
              <Pressable onLongPress={drag} delayLongPress={50}>
                <Ionicons
                  name="reorder-three-outline"
                  size={28}
                  color={theme["color-secondary-500"]}
                />
              </Pressable>
            ) : (
              !isExercise && (
                <Ionicons
                  name="chevron-down-outline"
                  color={theme["text-basic-color"]}
                  size={24}
                />
              )
            )}
          </View>
        </View>
        <Expandable expanded={isExpanded}>{children}</Expandable>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
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
    width: 36,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    paddingHorizontal: 6,
  },
  right: {
    alignItems: "flex-end",
    width: 36,
    justifyContent: "center",
  },
  restContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  restCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  restLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 1,
    top: "50%",
  },
  restTitle: {
    paddingHorizontal: 12,
    zIndex: 2,
    fontFamily: "TekoRegular",
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
    marginHorizontal: 30,
    paddingVertical: 2,
    textAlign: "center",
  },
  title: {
    fontFamily: "TekoRegular",
    textAlign: "center",
  },
  subInfo: {
    alignItems: "center",
    marginTop: 10,
  },
});
