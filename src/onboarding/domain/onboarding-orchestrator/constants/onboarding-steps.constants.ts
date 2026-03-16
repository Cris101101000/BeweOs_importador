import { OnboardingStep } from "../enums/onboarding-step.enum";

export const ONBOARDING_STEPS_LIST: OnboardingStep[] = [
	OnboardingStep.WELCOME,
	OnboardingStep.INTRO,
	OnboardingStep.TRAINING_SOURCES,
	OnboardingStep.BRAND_DEFINITION,
	OnboardingStep.BRAND_ADAPTATION,
	OnboardingStep.BUSINESS_VERTICAL,
	OnboardingStep.PAIN_POINTS,
	OnboardingStep.CONTACT_VOLUME,
	OnboardingStep.ANALYSIS_TRANSITION,
	OnboardingStep.BUSINESS_DIAGNOSTIC,
	OnboardingStep.FIRST_MEDAL,
	OnboardingStep.WHATSAPP_WOW,
	OnboardingStep.CHATBOT_SHOWCASE,
	OnboardingStep.SOCIAL_SHOWCASE,
	OnboardingStep.AUTOMATION_GRAND_FINALE,
];

export const STEPS_WITHOUT_BRAND = [
  OnboardingStep.WELCOME, 
  OnboardingStep.INTRO, 
	OnboardingStep.TRAINING_SOURCES,	
  OnboardingStep.BRAND_DEFINITION
];

export const DEFAULT_ONBOARDING_STEP: OnboardingStep =
	OnboardingStep.WELCOME;

/** Steps que no muestran la barra de progreso global */
export const STEPS_WITHOUT_PROGRESS_BAR: OnboardingStep[] = [
	OnboardingStep.WELCOME,
	OnboardingStep.INTRO,
];

/** Steps que no se guardan en app-storage (transitorios) */
export const NON_PERSISTABLE_STEPS: OnboardingStep[] = [
	OnboardingStep.WELCOME,
	OnboardingStep.INTRO,
	OnboardingStep.PAIN_POINTS,
	OnboardingStep.CONTACT_VOLUME,
	OnboardingStep.ANALYSIS_TRANSITION,
	OnboardingStep.BUSINESS_DIAGNOSTIC,
	OnboardingStep.FIRST_MEDAL,
];
