import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { FEATURES } from "src/onboarding/domain/first-medal";
import { ContinueButton, GradientHighlightText } from "src/onboarding/ui/_shared/components";
import { SolutionCard } from "../components";

interface FirstMedalScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const FirstMedalScreen = ({ onBack, onContinue }: FirstMedalScreenProps) => {

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Prepárate para ver el potencial real de tu negocio. He diseñado una estrategia completa para ti."
		translations={{ backButtonLabel: "Atrás" }}
			assistantState="excited"
			enableSequence={true}
			showBackButton
			onBack={onBack}
		>
			<div className="space-y-8">
				<div className="space-y-4">
					<motion.h1
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-4xl md:text-5xl font-serif italic font-normal text-gray-900 dark:text-white leading-tight"
					>
						Te ayudaré a explotar{" "}<GradientHighlightText>tu potencial</GradientHighlightText>
					</motion.h1>
				</div>

				<div className="space-y-3 py-2">
					{FEATURES.map((feature, index) => (
						<SolutionCard
							key={feature.problem}
							emoji={feature.emoji}
							problem={feature.problem}
							solution={feature.solution}
							delay={0.3 + index * 0.1}
							isHighlighted={false}
						/>
					))}
				</div>

				<ContinueButton
					label="Descubrir ahora"
					onPress={onContinue}
					delay={0.7}
				/>
			</div>
		</TwoColumnLayoutAgent>
	);
};
