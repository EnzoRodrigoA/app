import { Ionicons } from "@expo/vector-icons";
import { Text, useTheme } from "@ui-kitten/components";
import { memo } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "./Button";

interface InputControlDialProps {
  label: string;
  value: string;
  unit: string;
  onIncrement: () => void;
  onDecrement: () => void;
  valueColor?: string;
  onChangeText?: (text: string) => void;
  scaleWidth: number;
}

const InputControlDial = memo(function InputControlDial({
  label,
  value,
  unit,
  onIncrement,
  onDecrement,
  valueColor,
  onChangeText,
  scaleWidth,
}: InputControlDialProps) {
  const theme = useTheme();
  const normalizeSize = (size: number) => Math.round(size * scaleWidth);

  const dynamicStyles = StyleSheet.create({
    container: {
      alignItems: "center",
    },
    label: {
      fontSize: normalizeSize(16),
      fontWeight: "800",
      color: theme["text-hint-color"],
      letterSpacing: 0.5,
    },
    dialControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: normalizeSize(5),
    },
    dialButton: {
      borderRadius: normalizeSize(50),
      padding: 0,
      width: normalizeSize(55),
      height: normalizeSize(55),
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: normalizeSize(4) },
      shadowOpacity: 0.2,
      shadowRadius: normalizeSize(6),
      elevation: normalizeSize(3),
    },
    dialValueWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingHorizontal: normalizeSize(10),
    },
    dialValue: {
      fontSize: normalizeSize(50),
      fontWeight: "200",
      textAlign: "center",
      backgroundColor: "transparent",
      minWidth: normalizeSize(120),
      paddingVertical: 0,
    },
    dialUnit: {
      fontSize: normalizeSize(14),
      fontWeight: "200",
      opacity: 0.6,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={[dynamicStyles.label, { color: theme["text-basic-color"] }]}>
        {label}
      </Text>
      <View style={dynamicStyles.dialControls}>
        <Button
          onPress={onDecrement}
          style={[
            dynamicStyles.dialButton,
            { backgroundColor: theme["background-basic-color-3"] },
          ]}
          content={
            <Ionicons
              name="remove-outline"
              size={normalizeSize(16)} // Tamanho do ícone normalizado
              color={theme["text-basic-color"]}
            />
          }
        />

        <View style={dynamicStyles.dialValueWrapper}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            keyboardType="numeric"
            selectTextOnFocus
            selectionColor={theme["color-primary-500"]}
            style={[
              dynamicStyles.dialValue,
              { color: valueColor || theme["text-basic-color"] },
            ]}
            maxLength={5}
          />
          <Text
            style={[
              dynamicStyles.dialUnit,
              { color: theme["text-hint-color"] },
            ]}
          >
            {unit}
          </Text>
        </View>

        <Button
          onPress={onIncrement}
          style={[
            dynamicStyles.dialButton,
            { backgroundColor: theme["background-basic-color-3"] },
          ]}
          content={
            <Ionicons
              name="add-outline"
              size={normalizeSize(16)} // Tamanho do ícone normalizado
              color={theme["text-basic-color"]}
            />
          }
        />
      </View>
    </View>
  );
});

export default InputControlDial;
