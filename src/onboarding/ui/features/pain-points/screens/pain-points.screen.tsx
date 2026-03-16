import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PAIN_POINTS, PainPointId } from "src/onboarding/domain/pain-points";
import { ContinueButton, OptionCard } from "src/onboarding/ui/_shared/components";
import { usePainPointsStore } from "../store";

interface PainPointsScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const PainPointsScreen = ({ onBack, onContinue }: PainPointsScreenProps) => {
	const selectedPainPoints = usePainPointsStore((state) => state.selectedPainPoints);
	const setSelectedPainPoints = usePainPointsStore(
		(state) => state.setSelectedPainPoints
	);

	const [selectedSet, setSelectedSet] = useState<Set<PainPointId>>(
		() => new Set(selectedPainPoints)
	);

	const selectedCount = useMemo(() => selectedSet.size, [selectedSet]);

	const handleToggle = (id: PainPointId) => {
		const newSet = new Set(selectedSet);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		setSelectedSet(newSet);
	};

	const handleContinue = () => {
		if (selectedSet.size === 0) {
			return;
		}

		setSelectedPainPoints(Array.from(selectedSet));
		onContinue();
	};

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Cuéntame, ¿con cuáles de estos problemas te identificas? Puedes seleccionar todos los que apliquen."
		translations={{ backButtonLabel: "Atrás" }}
			assistantState="thinking"
			assistantSize="xl"
			enableSequence={true}
			showBackButton
			onBack={onBack}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="flex flex-col gap-6 w-full mt-6 pb-24"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="text-center space-y-2"
				>
					<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
						¿Qué frena tu crecimiento?
					</h2>
				</motion.div>

				<div className="grid grid-cols-2 gap-3">
					{PAIN_POINTS.map((painPoint, index) => (
						<motion.div
							key={painPoint.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 + index * 0.08, duration: 0.3 }}
						>
							<OptionCard
								emoji={painPoint.emoji}
								title={painPoint.title}
								isSelected={selectedSet.has(painPoint.id)}
								onSelect={() => handleToggle(painPoint.id)}
							/>
						</motion.div>
					))}
				</div>

				<ContinueButton
					onPress={handleContinue}
					isDisabled={selectedCount === 0}
					showOpacityAnimation={true}
					opacity={selectedCount > 0 ? 1 : 0.3}
				/>
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
