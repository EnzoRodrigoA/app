export type QuestionType = "number" | "date" | "select" | "slider";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  default?: number;
}
