import { Button } from "@beweco/aurora-ui";
import { AnimatePresence } from "framer-motion";
import { useBrandDefinitionStore } from "src/onboarding/ui/_shared/store";
import { FinalCelebration, SlidePhase } from "../components";
import { useAutomationGrandFinale } from "../hooks";

interface AutomationGrandFinaleScreenProps {
	onBack: () => void;
	onContinue: () => void;
	isLoading?: boolean;
}

export const AutomationGrandFinaleScreen = ({
	onBack,
	onContinue,
	isLoading,
}: AutomationGrandFinaleScreenProps) => {
	const businessName = useBrandDefinitionStore(
		(state) => state.data.businessName
	);
	const { phase, activeSlide, assistantSpeech } = useAutomationGrandFinale();

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-gray-900">
			<div className="fixed top-6 left-6 z-40">
				<Button
					variant="light"
					size="sm"
					onPress={onBack}
					className="bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3"
					startContent={
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					}
				>
					Atrás
				</Button>
			</div>

			<AnimatePresence mode="wait">
				{phase !== "final" && activeSlide ? (
					<SlidePhase
						key={phase}
						activeSlide={activeSlide}
						assistantSpeech={assistantSpeech}
					/>
				) : null}

				{phase === "final" ? (
					<FinalCelebration
						key="final"
						businessName={businessName}
						onContinue={onContinue}
						isLoading={isLoading}
					/>
				) : null}
			</AnimatePresence>
		</div>
	);
};
