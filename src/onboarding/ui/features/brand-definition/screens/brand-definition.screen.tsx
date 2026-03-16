import { TwoColumnLayoutAgent } from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { useId } from "react";
import { ContinueButton } from "src/onboarding/ui/_shared/components";
import { BrandColors, BrandFormFields, BrandLogoUpload } from "../components";
import { useBrandDefinition } from "../hooks";

interface BrandDefinitionScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const BrandDefinitionScreen = ({
	onBack,
	onContinue,
}: BrandDefinitionScreenProps) => {
	const businessNameId = useId();
	const descriptionId = useId();
	const primaryColorId = useId();
	const secondaryColorId = useId();

	const {
		businessName,
		setBusinessName,
		description,
		setDescription,
		primaryColor,
		setPrimaryColor,
		secondaryColor,
		setSecondaryColor,
		logoUrl,
		isFetching,
		isSaving,
		handleLogoUpload,
		handleLogoRemove,
		handleSave,
	} = useBrandDefinition();

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Ahora voy a conocer mejor tu marca. He extraído información de tu sitio web, pero puedes ajustarla como prefieras."
			translations={{ backButtonLabel: "Atrás" }}
			assistantState="happy"
			assistantSize="xl"
			enableSequence={true}
			showBackButton={false}
			onBack={onBack}
		>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-4 py-1"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="text-center space-y-2"
				>
					<h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-gray-900 dark:text-white">
						Definición de Marca
					</h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.5 }}
					className="space-y-6"
				>
					<BrandFormFields
						businessNameId={businessNameId}
						descriptionId={descriptionId}
						businessName={businessName}
						description={description}
						isFetching={isFetching}
						onBusinessNameChange={setBusinessName}
						onDescriptionChange={setDescription}
					/>

					<BrandColors
						primaryColorId={primaryColorId}
						secondaryColorId={secondaryColorId}
						primaryColor={primaryColor}
						secondaryColor={secondaryColor}
						isFetching={isFetching}
						onPrimaryColorChange={setPrimaryColor}
						onSecondaryColorChange={setSecondaryColor}
					/>

					<BrandLogoUpload
						logoUrl={logoUrl}
						isFetching={isFetching}
						onLogoUpload={handleLogoUpload}
						onLogoRemove={handleLogoRemove}
					/>
				</motion.div>

				<ContinueButton
					delay={1}
					// isDisabled={!isFormValid || isFetching || isSaving}
					isLoading={isSaving}
					onPress={async () => {
						const success = await handleSave();
						if (success) onContinue();
					}}
				/>
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
