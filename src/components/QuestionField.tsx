import { Question } from "@/types/QuestionTypes";
import Slider from "@react-native-community/slider";
import {
  CalendarViewModes,
  Datepicker,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

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
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | null>(null);
  switch (question.type) {
    case "number":
      return (
        <Layout style={styles.container}>
          <Text
            category="h4"
            appearance="default"
            status="basic"
            style={styles.label}
          >
            {question.label}
          </Text>
          <Input
            keyboardType="numeric"
            value={value?.toString() || ""}
            onChangeText={(text) => onChange(question.id, Number(text))}
          />
        </Layout>
      );

    case "date":
      return (
        <Layout style={styles.container}>
          <Text
            category="h4"
            appearance="default"
            status="basic"
            style={styles.label}
          >
            {question.label}
          </Text>
          <Datepicker
            date={value ? new Date(value + "T00:00:00") : new Date()}
            startView={CalendarViewModes.YEAR}
            onSelect={(nextDate) => {
              const year = nextDate.getFullYear();
              const month = nextDate.getMonth() + 1;
              const day = nextDate.getDate();
              const formatted = `${year}-${String(month).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              onChange(question.id, formatted);
              onChange(question.id, formatted);
            }}
            min={new Date(1920, 0, 1)}
            max={new Date(2015, 11, 31)}
          />
        </Layout>
      );

    case "select":
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
      const displayValue = value ? optionLabels[value] || value : undefined;
      return (
        <Layout style={styles.container}>
          <Text
            category="h4"
            appearance="default"
            status="basic"
            style={styles.label}
          >
            {question.label}
          </Text>
          <Select
            selectedIndex={selectedIndex || undefined}
            value={displayValue}
            onSelect={(index) => {
              const selected = index as IndexPath;
              setSelectedIndex(selected);
              const backendValue = question.options?.[selected.row];
              onChange(question.id, backendValue);
            }}
            placeholder="Selecione uma opção"
          >
            {question.options?.map((option, idx) => (
              <SelectItem key={idx} title={optionLabels[option] || option} />
            ))}
          </Select>
        </Layout>
      );

    case "slider":
      const sliderStatus =
        value === 2 || value === 6
          ? "warning"
          : value === 7 || value === 1
          ? "danger"
          : "success";
      const text = value === 1 ? "dia" : "dias";
      return (
        <Layout style={styles.container}>
          <Text
            category="h4"
            appearance="default"
            status="basic"
            style={styles.label}
          >
            {question.label}
          </Text>
          <Text
            category="h1"
            appearance="alternative"
            status={sliderStatus}
            style={styles.sliderValue}
          >
            {value || question.default || question.min || 0} {text}
          </Text>

          <Slider
            minimumValue={question.min || 1}
            maximumValue={question.max || 7}
            value={value || question.default || 0}
            onValueChange={(val) => onChange(question.id, val)}
            step={1}
          />
        </Layout>
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
  },
  progress: {
    marginTop: 12,
  },
  sliderValue: {
    textAlign: "center",
    marginBottom: 8,
  },
});
