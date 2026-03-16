import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface UseOnboardingStepParams {
	defaultStep: string;
	allowedSteps: readonly string[];
}

export const useOnboardingStep = ({
	defaultStep,
	allowedSteps,
}: UseOnboardingStepParams) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const currentStepFromUrl = searchParams.get("step");
	const isStepValid = Boolean(
		currentStepFromUrl && allowedSteps.includes(currentStepFromUrl)
	);

	const currentStep = isStepValid ? currentStepFromUrl : defaultStep;

	useEffect(() => {
		if (isStepValid) {
			return;
		}

		setSearchParams({ step: defaultStep }, { replace: true });
	}, [defaultStep, isStepValid, setSearchParams]);

	const goToStep = useCallback(
		(step: string) => {
			setSearchParams({ step }, { replace: true });
		},
		[setSearchParams]
	);

	return {
		currentStep,
		goToStep,
	};
};
