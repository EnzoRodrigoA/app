import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Question } from "@/types/QuestionTypes";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface QuestionFieldProps {
  question: Question;
  value: any;
  onChange: (id: string, value: any) => void;
}

export const QuestionField: React.FC<QuestionFieldProps> = ({
  question,
  value,
  onChange,
}) => {
  const { theme } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);

  const optionLabels: Record<string, string> = {
    male: "Masculino",
    female: "Feminino",
    other: "Outro",
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
    gain_mass: "Ganho de Massa",
    lose_fat: "Perda de Gordura",
    maintain: "Manutenção",
  };

  const getSliderStatusColor = (val: number) => {
    if (val === 2 || val === 6) {
      return theme.colors.warning;
    } else if (val === 7 || val === 1) {
      return theme.colors.error;
    } else {
      return theme.colors.success;
    }
  };

  switch (question.type) {
    case "number":
      return (
        <View style={styles.container}>
          <Text variant="h1" style={styles.label}>
            {question.label}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.background.tertiary,
                color: theme.colors.text.primary,
              },
            ]}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.text.secondary}
            value={value?.toString() || ""}
            onChangeText={(text) => onChange(question.id, Number(text))}
          />
        </View>
      );

    case "date":
      const currentDate = value ? new Date(value + "T00:00:00") : new Date();

      return (
        <View style={styles.container}>
          <Text variant="h1" style={styles.label}>
            {question.label}
          </Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.background.tertiary,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text variant="body" style={{ color: theme.colors.text.primary }}>
              {currentDate.toLocaleDateString("pt-BR")}
            </Text>
          </TouchableOpacity>

          {showDatePicker &&
            (Platform.OS === "ios" ? (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View
                    style={[
                      styles.modalContent,
                      { backgroundColor: theme.colors.background.primary },
                    ]}
                  >
                    <DateTimePicker
                      value={currentDate}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          const year = selectedDate.getFullYear();
                          const month = selectedDate.getMonth() + 1;
                          const day = selectedDate.getDate();
                          const formatted = `${year}-${String(month).padStart(
                            2,
                            "0"
                          )}-${String(day).padStart(2, "0")}`;
                          onChange(question.id, formatted);
                        }
                      }}
                      minimumDate={new Date(1920, 0, 1)}
                      maximumDate={new Date(2015, 11, 31)}
                    />
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        { backgroundColor: theme.colors.primary[500] },
                      ]}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text variant="body" style={styles.buttonText}>
                        Confirmar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const year = selectedDate.getFullYear();
                    const month = selectedDate.getMonth() + 1;
                    const day = selectedDate.getDate();
                    const formatted = `${year}-${String(month).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(2, "0")}`;
                    onChange(question.id, formatted);
                  }
                }}
                minimumDate={new Date(1920, 0, 1)}
                maximumDate={new Date(2015, 11, 31)}
              />
            ))}
        </View>
      );

    case "select":
      const displayValue = value
        ? optionLabels[value] || value
        : "Selecione uma opção";

      return (
        <View style={styles.container}>
          <Text variant="h1" style={styles.label}>
            {question.label}
          </Text>
          <TouchableOpacity
            style={[
              styles.selectButton,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.background.tertiary,
              },
            ]}
            onPress={() => setShowSelectModal(true)}
          >
            <Text variant="body" style={{ color: theme.colors.text.primary }}>
              {displayValue}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={showSelectModal}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.background.primary },
                ]}
              >
                <Text variant="h2" style={styles.modalTitle}>
                  {question.label}
                </Text>
                <FlatList
                  data={question.options || []}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        {
                          backgroundColor:
                            value === item
                              ? theme.colors.primary[500]
                              : theme.colors.background.secondary,
                          borderBottomColor: theme.colors.background.tertiary,
                        },
                      ]}
                      onPress={() => {
                        onChange(question.id, item);
                        setShowSelectModal(false);
                      }}
                    >
                      <Text
                        variant="body"
                        style={[
                          styles.optionText,
                          {
                            color:
                              value === item
                                ? "white"
                                : theme.colors.text.primary,
                          },
                        ]}
                      >
                        {optionLabels[item] || item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: theme.colors.background.tertiary },
                  ]}
                  onPress={() => setShowSelectModal(false)}
                >
                  <Text
                    variant="body"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );

    case "slider":
      const sliderValue = value || question.default || question.min || 0;
      const text = sliderValue === 1 ? "dia" : "dias";

      return (
        <View style={styles.container}>
          <Text variant="h1" style={styles.label}>
            {question.label}
          </Text>
          <Text
            variant="h1"
            style={[
              styles.sliderValue,
              { color: getSliderStatusColor(sliderValue) },
            ]}
          >
            {sliderValue} {text}
          </Text>

          <Slider
            minimumValue={question.min || 1}
            maximumValue={question.max || 7}
            value={sliderValue}
            onValueChange={(val) => onChange(question.id, val)}
            step={1}
            minimumTrackTintColor={theme.colors.primary[500]}
            maximumTrackTintColor={theme.colors.background.tertiary}
            thumbTintColor={theme.colors.primary[500]}
          />
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    paddingVertical: 20,
    fontFamily: "TekoRegular",
    fontSize: 36,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sliderValue: {
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "TekoRegular",
    fontSize: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  optionText: {
    textAlign: "center",
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
