import { useMemo } from "react";
import { getGreeting } from "@/utils/date-helpers";

/**
 * Custom hook to get greeting message based on current time
 * @returns {string} Localized greeting message
 */
export const useGreeting = (): string => {
  return useMemo(() => getGreeting(), []);
};
