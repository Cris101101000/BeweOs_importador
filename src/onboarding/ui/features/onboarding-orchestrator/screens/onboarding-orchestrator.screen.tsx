import { OnboardingStep } from "src/onboarding/domain/onboarding-orchestrator";
import { ProgressBar } from "src/onboarding/ui/_shared/components";
import { useOnboardingProgress } from "src/onboarding/ui/_shared/hooks";
import { ChangePasswordModal } from "src/shared/features/change-password";
import { AnalysisTransitionScreen } from "../../analysis-transition";
import { AutomationGrandFinaleScreen } from "../../automation-grand-finale";
import { BrandAdaptationScreen } from "../../brand-adaptation";
import { BrandDefinitionScreen } from "../../brand-definition";
import { BusinessDiagnosticScreen } from "../../business-diagnostic";
import { BusinessVerticalScreen } from "../../business-vertical";
import { ChatbotShowcaseScreen } from "../../chatbot-showcase";
import { ContactVolumeScreen } from "../../contact-volume";
import { FirstMedalScreen } from "../../first-medal";
import { IntroScreen } from "../../intro";
import { PainPointsScreen } from "../../pain-points";
import { SocialShowcaseScreen } from "../../social-showcase";
import { TrainingSourcesScreen } from "../../training-sources";
import { WelcomeScreen } from "../../welcome";
import { WhatsAppWowScreen } from "../../whatsapp-wow";
import { useOnboardingOrchestrator } from "../hooks";
import { useOnboardingBrand } from "src/onboarding/ui/_shared/hooks/use-onboarding-brand.hook";

export const OnboardingOrchestratorScreen = () => {
	const {
		currentStep,
		goToStep,
		goToDashboard,
		showChangePassword,
		handleEnterBeweOS,
		handlePasswordChanged,
		isLoadingProgress,
	} = useOnboardingOrchestrator();

	// Custom hook to apply brand colors during onboarding
	useOnboardingBrand()

	const {
		showProgressBar,
		progressPercentage,
		currentProgressStep,
		totalProgressSteps,
	} = useOnboardingProgress({ currentStep });

	if (isLoadingProgress) return null;

	const getStepScreen = () => {
		switch (currentStep) {
			case OnboardingStep.WELCOME:
				return (
					<WelcomeScreen
						onBack={goToDashboard}
						onContinue={() => goToStep(OnboardingStep.INTRO)}
					/>
				);

			case OnboardingStep.INTRO:
				return (
					<IntroScreen
						onBack={() => goToStep(OnboardingStep.WELCOME)}
						onContinue={() => goToStep(OnboardingStep.TRAINING_SOURCES)}
					/>
				);

			case OnboardingStep.TRAINING_SOURCES:
				return (
					<TrainingSourcesScreen
						onBack={goToDashboard}
						onContinue={() => goToStep(OnboardingStep.BRAND_DEFINITION)}
					/>
				);

			case OnboardingStep.PAIN_POINTS:
				return (
					<PainPointsScreen
						onBack={() => goToStep(OnboardingStep.BUSINESS_VERTICAL)}
						onContinue={() => goToStep(OnboardingStep.CONTACT_VOLUME)}
					/>
				);

			case OnboardingStep.CONTACT_VOLUME:
				return (
					<ContactVolumeScreen
						onBack={() => goToStep(OnboardingStep.PAIN_POINTS)}
						onContinue={() => goToStep(OnboardingStep.ANALYSIS_TRANSITION)}
					/>
				);

			case OnboardingStep.BUSINESS_VERTICAL:
				return (
					<BusinessVerticalScreen
						onBack={() => goToStep(OnboardingStep.BRAND_ADAPTATION)}
						onContinue={() => goToStep(OnboardingStep.PAIN_POINTS)}
					/>
				);

			case OnboardingStep.ANALYSIS_TRANSITION:
				return (
					<AnalysisTransitionScreen
						onBack={() => goToStep(OnboardingStep.CONTACT_VOLUME)}
						onContinue={() => goToStep(OnboardingStep.BUSINESS_DIAGNOSTIC)}
					/>
				);

			case OnboardingStep.BUSINESS_DIAGNOSTIC:
				return (
					<BusinessDiagnosticScreen
						onBack={() => goToStep(OnboardingStep.ANALYSIS_TRANSITION)}
						onContinue={() => goToStep(OnboardingStep.FIRST_MEDAL)}
					/>
				);

			case OnboardingStep.FIRST_MEDAL:
				return (
					<FirstMedalScreen
						onBack={() => goToStep(OnboardingStep.BUSINESS_DIAGNOSTIC)}
						onContinue={() => goToStep(OnboardingStep.WHATSAPP_WOW)}
					/>
				);

			case OnboardingStep.WHATSAPP_WOW:
				return (
					<WhatsAppWowScreen
						onBack={() => goToStep(OnboardingStep.FIRST_MEDAL)}
						onContinue={() => goToStep(OnboardingStep.CHATBOT_SHOWCASE)}
					/>
				);

			case OnboardingStep.SOCIAL_SHOWCASE:
				return (
					<SocialShowcaseScreen
						onBack={() => goToStep(OnboardingStep.WHATSAPP_WOW)}
						onContinue={() => goToStep(OnboardingStep.AUTOMATION_GRAND_FINALE)}
					/>
				);

			case OnboardingStep.CHATBOT_SHOWCASE:
				return (
					<ChatbotShowcaseScreen
						onBack={() => goToStep(OnboardingStep.WHATSAPP_WOW)}
						onContinue={() => goToStep(OnboardingStep.SOCIAL_SHOWCASE)}
					/>
				);

			case OnboardingStep.AUTOMATION_GRAND_FINALE:
				return (
					<AutomationGrandFinaleScreen
						onBack={() => goToStep(OnboardingStep.CHATBOT_SHOWCASE)}
						onContinue={handleEnterBeweOS}
					/>
				);

			case OnboardingStep.BRAND_DEFINITION:
				return (
					<BrandDefinitionScreen
						onBack={() => goToStep(OnboardingStep.TRAINING_SOURCES)}
						onContinue={() => goToStep(OnboardingStep.BRAND_ADAPTATION)}
					/>
				);

			case OnboardingStep.BRAND_ADAPTATION:
				return (
					<BrandAdaptationScreen
						onBack={() => goToStep(OnboardingStep.BRAND_DEFINITION)}
						onContinue={() => goToStep(OnboardingStep.BUSINESS_VERTICAL)}
					/>
				);

			default:
				return (
					<WelcomeScreen
						onBack={goToDashboard}
						onContinue={() => goToStep(OnboardingStep.INTRO)}
					/>
				);
		}
	};

	return (
		<>
			{showProgressBar && (
				<ProgressBar
					progressPercentage={progressPercentage}
					currentStep={currentProgressStep}
					totalSteps={totalProgressSteps}
				/>
			)}
			{getStepScreen()}
			<ChangePasswordModal
				isOpen={showChangePassword}
				onSuccess={handlePasswordChanged}
			/>
		</>
	);
};
