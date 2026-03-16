import { useMemo } from "react";
import {
	ONBOARDING_STEPS_LIST,
	type OnboardingStep,
	STEPS_WITHOUT_PROGRESS_BAR,
} from "src/onboarding/domain/onboarding-orchestrator";

interface UseOnboardingProgressParams {
	currentStep: OnboardingStep;
}

export const useOnboardingProgress = ({
	currentStep,
}: UseOnboardingProgressParams) => {
	return useMemo(() => {
		const showProgressBar = !STEPS_WITHOUT_PROGRESS_BAR.includes(currentStep);
		const currentIndex = ONBOARDING_STEPS_LIST.indexOf(currentStep);

		const progressStartIndex = STEPS_WITHOUT_PROGRESS_BAR.length;
		const totalProgressSteps = ONBOARDING_STEPS_LIST.length - progressStartIndex;

		const currentProgressStep = Math.max(0, currentIndex - progressStartIndex);
		const progressPercentage = ((currentProgressStep + 1) / totalProgressSteps) * 100;

		return {
			showProgressBar,
			progressPercentage,
			currentProgressStep,
			totalProgressSteps,
		};
	}, [currentStep]);
};
