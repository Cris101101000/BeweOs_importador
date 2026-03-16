import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { useState } from "react";
import { CONTACT_RANGES, ContactRangeId } from "src/onboarding/domain/contact-volume";
import { ContinueButton, OptionCard } from "src/onboarding/ui/_shared/components";
import { useContactVolumeStore } from "../store";

interface ContactVolumeScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const ContactVolumeScreen = ({
	onBack,
	onContinue,
}: ContactVolumeScreenProps) => {
	const selectedRangeFromStore = useContactVolumeStore((state) => state.selectedRange);
	const setSelectedRange = useContactVolumeStore((state) => state.setSelectedRange);

	const [selectedRange, setSelectedRangeLocal] = useState<ContactRangeId | null>(
		selectedRangeFromStore
	);

	const handleContinue = () => {
		if (!selectedRange) {
			return;
		}

		setSelectedRange(selectedRange);
		onContinue();
	};

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Interesante… Ahora dime, ¿con cuántos contactos comerciales trabajas al mes?"
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
				className="flex flex-col gap-3 w-full max-w-3xl mx-auto pb-24 px-5"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="text-center"
				>
					<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
						Cantidad de Contactos Mensuales
					</h2>
				</motion.div>

				<div className="grid grid-cols-2 gap-2.5 py-2">
					{CONTACT_RANGES.map((range, index) => (
						<motion.div
							key={range.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.5 + index * 0.06, duration: 0.3 }}
							className="h-full"
						>
							<OptionCard
								emoji={range.emoji}
								title={range.label}
								subtitle={range.range}
								isSelected={selectedRange === range.id}
								onSelect={() => setSelectedRangeLocal(range.id)}
							/>
						</motion.div>
					))}
				</div>

				<ContinueButton
					onPress={handleContinue}
					isDisabled={!selectedRange}
					showOpacityAnimation={true}
					opacity={selectedRange ? 1 : 0.3}
				/>
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
