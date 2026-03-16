import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { ContinueButton } from "src/onboarding/ui/_shared/components";
import { useBrandAdaptation } from "../hooks";

interface BrandAdaptationScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const BrandAdaptationScreen = ({
	onBack,
	onContinue,
}: BrandAdaptationScreenProps) => {
	const { businessName, setAdaptationConfirmed } = useBrandAdaptation();

	return (
		<TwoColumnLayoutAgent
			assistantSpeech={`Ya me he adaptado a tu marca. A partir de ahora hablaré de ${businessName} respetando su identidad.`}
			assistantState="inspired"
		translations={{ backButtonLabel: "Atrás" }}
			assistantSize="xl"
			enableSequence={true}
			showBackButton={false}
			onBack={onBack}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="flex flex-col gap-8 w-full max-w-2xl mx-auto px-6 py-6"
			>
				<div className="text-center space-y-3">
					<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
						Identidad aplicada
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-400 font-sans font-normal">
						La forma en que Linda se ve y se expresa ya refleja tu marca.
					</p>
				</div>
			</motion.div>

			<ContinueButton
				delay={0.5}
				onPress={() => {
					setAdaptationConfirmed(true);
					onContinue();
				}}
			/>
		</TwoColumnLayoutAgent>
	);
};
