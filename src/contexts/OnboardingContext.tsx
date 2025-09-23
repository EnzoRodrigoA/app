import { createContext, ReactNode, useContext, useState } from "react";

interface OnboardingContextProps {
  answers: Record<string, any>;
  updateAnswer: (id: string, value: any) => void;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(
  undefined
);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState({});
  const updateAnswer = (id: string, value: any) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  return (
    <OnboardingContext.Provider value={{ answers, updateAnswer }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextProps => {
  const context = useContext(OnboardingContext);
  if (!context)
    throw new Error("UseOnboarding must be used within OnboardingProvider");
  return context;
};
