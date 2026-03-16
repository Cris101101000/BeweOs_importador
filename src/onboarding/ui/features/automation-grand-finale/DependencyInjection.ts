import { ActivateOnboardingUseCase } from "src/onboarding/application/onboarding-activate";
import { OnboardingActivateAdapter } from "src/onboarding/infrastructure/onboarding-activate";

const repository = new OnboardingActivateAdapter();

export const ActivateOnboarding = () =>
	new ActivateOnboardingUseCase(repository).execute();
