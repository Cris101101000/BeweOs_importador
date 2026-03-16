import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	DEFAULT_ONBOARDING_STEP,
	NON_PERSISTABLE_STEPS,
	ONBOARDING_STEPS_LIST,
	type OnboardingStep,
} from "src/onboarding/domain/onboarding-orchestrator";
import { useOnboardingStep } from "src/onboarding/ui/_shared/hooks";
import { GetAppStorage, SaveAppStorage } from "src/shared/features/app-storage";
import { ActivateOnboarding } from "../../automation-grand-finale/DependencyInjection";
import { useOnboardingOrchestratorStore } from "../store";

const STORAGE_TYPE = "onboarding_progress";
const STORAGE_SCOPE = "company";

export const useOnboardingOrchestrator = () => {
	const navigate = useNavigate();
	const [isLoadingProgress, setIsLoadingProgress] = useState(true);
	const hasLoadedRef = useRef(false);

	const { currentStep, goToStep } = useOnboardingStep({
		defaultStep: DEFAULT_ONBOARDING_STEP,
		allowedSteps: ONBOARDING_STEPS_LIST,
	});
	const setLastVisitedStep = useOnboardingOrchestratorStore(
		(state) => state.setLastVisitedStep
	);

	useEffect(() => {
		if (hasLoadedRef.current) return;
		hasLoadedRef.current = true;

		const loadProgress = async () => {
			const result = await GetAppStorage(STORAGE_TYPE, STORAGE_SCOPE);

			if (result.isSuccess && result.value) {
				const savedStep = result.value.value;

				if (ONBOARDING_STEPS_LIST.includes(savedStep as OnboardingStep)) {
					goToStep(savedStep);
				}
			}

			setIsLoadingProgress(false);
		};

		loadProgress();
	}, [goToStep]);

	useEffect(() => {
		setLastVisitedStep(currentStep as OnboardingStep);

		if (isLoadingProgress) return;

		const isNonPersistable = NON_PERSISTABLE_STEPS.includes(
			currentStep as OnboardingStep
		);
		if (isNonPersistable) return;

		SaveAppStorage({
			type: STORAGE_TYPE,
			scope: STORAGE_SCOPE,
			value: currentStep as string,
			// biome-ignore lint/suspicious/noEmptyBlockStatements: fire-and-forget, errors are silently ignored
		}).catch(() => {});
	}, [currentStep, setLastVisitedStep, isLoadingProgress]);

	const [showChangePassword, setShowChangePassword] = useState(false);

	const handleEnterBeweOS = useCallback(() => {
		setShowChangePassword(true);
	}, []);

	const handlePasswordChanged = useCallback(async () => {
		const result = await ActivateOnboarding();
		if (result.isSuccess) {
			navigate("/dashboard");
			window.location.reload()
		}
	}, [navigate]);

	return {
		currentStep: currentStep as OnboardingStep,
		goToStep: (step: OnboardingStep) => goToStep(step),
		goToDashboard: () => navigate("/dashboard"),
		showChangePassword,
		handleEnterBeweOS,
		handlePasswordChanged,
		isLoadingProgress,
	};
};
