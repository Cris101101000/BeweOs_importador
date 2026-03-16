import { Select, SelectItem, TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { type Key, useId, useState } from "react";
import { ContinueButton } from "src/onboarding/ui/_shared/components";
import { useBusinessVerticalStore } from "../store";
import { useVerticalsFetch } from "../hooks/use-verticals-fetch.hook";
import { useVerticalSave } from "../hooks/use-vertical-save.hook";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface BusinessVerticalScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const BusinessVerticalScreen = ({
	onBack,
	onContinue,
}: BusinessVerticalScreenProps) => {
	const selectId = useId();
	const setStoredVertical = useBusinessVerticalStore(
		(s) => s.setSelectedVertical,
	);

	const { verticals, isFetching } = useVerticalsFetch();
	const { isSaving, handleSave } = useVerticalSave();

	const [selected, setSelected] = useState<string | null>(null);

	const selectedKeys = selected ? new Set<Key>([selected]) : new Set<Key>();

	const handleSelectionChange = (keys: "all" | Set<Key>) => {
		if (keys === "all" || keys.size === 0) return;
		setSelected(String(Array.from(keys)[0]));
	};

	const handleContinue = async () => {
		if (!selected) return;

		const success = await handleSave(selected);
		if (success) {
			setStoredVertical(selected);
			onContinue();
		}
	};

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Perfecto. Ahora dime, ¿a qué sector pertenece tu negocio?"
			translations={{ backButtonLabel: "Atrás" }}
			assistantState="happy"
			assistantSize="xl"
			enableSequence={true}
			showBackButton
			onBack={onBack}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="flex flex-col gap-6 w-full h-full overflow-y-auto px-3"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="text-center space-y-2 pt-2"
				>
					<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
						El Sector de tu Negocio
					</h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="w-full max-w-2xl mx-auto pb-24"
				>
					<label
						htmlFor={selectId}
						className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
					>
						Sector de tu negocio
					</label>
					<Select
						id={selectId}
						selectionMode="single"
						selectedKeys={selectedKeys}
						onSelectionChange={handleSelectionChange}
						placeholder="Selecciona un sector"
						variant="bordered"
						size="lg"
						radius="md"
						isLoading={isFetching}
						isDisabled={isFetching}
						classNames={{
							base: "w-full",
							trigger: "min-h-14",
						}}
					>
						{verticals.map((vertical) => (
							<SelectItem key={vertical} textValue={capitalize(vertical)}>
								{capitalize(vertical)}
							</SelectItem>
						))}
					</Select>
				</motion.div>

				{selected && (
					<ContinueButton
						onPress={handleContinue}
						isLoading={isSaving}
					/>
				)}
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
