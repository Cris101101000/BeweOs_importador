import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
	OnboardingStep,
	DEFAULT_ONBOARDING_STEP,
} from "src/onboarding/domain/onboarding-orchestrator";

interface OnboardingOrchestratorStore {
	lastVisitedStep: OnboardingStep;
	setLastVisitedStep: (step: OnboardingStep) => void;
	reset: () => void;
}

export const useOnboardingOrchestratorStore =
	create<OnboardingOrchestratorStore>()(
		persist(
			(set) => ({
				lastVisitedStep: DEFAULT_ONBOARDING_STEP,
				setLastVisitedStep: (step) => set({ lastVisitedStep: step }),
				reset: () => set({ lastVisitedStep: OnboardingStep.TRAINING_SOURCES }),
			}),
			{
				name: "onboarding-orchestrator-store",
				storage: createJSONStorage(() => sessionStorage),
			}
		)
	);
