import { useEffect } from "react";
import { useBrandDefinitionStore } from "../store"
import { useThemeContext } from "@beweco/aurora-ui";
import { OnboardingStep } from "src/onboarding/domain";
// import { useLocation } from "react-router-dom";
import { STEPS_WITHOUT_BRAND } from "src/onboarding/domain/onboarding-orchestrator/constants/onboarding-steps.constants";

export const useOnboardingBrand = () => {
  const primaryColor = useBrandDefinitionStore(store => store.data.primaryColor);
  const { setColor } = useThemeContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get("step") as OnboardingStep | null;

    if (stepParam && !STEPS_WITHOUT_BRAND.includes(stepParam)) {
      setColor(primaryColor);
    }

  }, [primaryColor]);
} 