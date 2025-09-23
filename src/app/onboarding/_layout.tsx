import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { Layout } from "@ui-kitten/components";
import { Slot } from "expo-router";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Layout style={{ flex: 1 }}>
        <Slot />
      </Layout>
    </OnboardingProvider>
  );
}
