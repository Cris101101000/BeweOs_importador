import {
	TwoColumnLayoutAgent,
} from "@beweco/aurora-ui";
import { motion } from "framer-motion";
import { ContinueButton } from "src/onboarding/ui/_shared/components";
import {
	TrainingSourceCard,
	TrainingSourcesHeader,
} from "../components";
import type { TrainingSourceType } from "../hooks";
import { useTrainingSources } from "../hooks";

const TRAINING_SOURCES: Array<{
	icon: string;
	label: string;
	desc: string;
	type: TrainingSourceType;
}> = [
	{
		icon: "🌐",
		label: "Sitio web",
		desc: "Página web de tu negocio",
		type: "website",
	},
	{
		icon: "📄",
		label: "Archivos",
		desc: "Subir documentos",
		type: "files",
	},
	{
		icon: "✍️",
		label: "Describe tu empresa",
		desc: "Escribir información",
		type: "text",
	},
];

interface TrainingSourcesScreenProps {
	onBack: () => void;
	onContinue: () => void;
}

export const TrainingSourcesScreen = ({
	onBack,
	onContinue,
}: TrainingSourcesScreenProps) => {
	const {
		handleAddText,
		handleAddWebsite,
		handleToggleExpand,
		handleRemoveFile,
		handleUploadFiles,
		handleSave,
		expandedCard,
		selectedSources,
		isLoading,
		isWebsiteUrlValid,
		setTextInput,
		setWebsiteUrl,
		textInput,
		uploadedFiles,
		websiteValidationMessage,
		websiteUrl,
	} = useTrainingSources();

	const handleContinue = async () => {
		const success = await handleSave();
		if (success) onContinue();
	};

	return (
		<TwoColumnLayoutAgent
			assistantSpeech="Para ayudarte mejor, necesito conocer tu negocio. ¿Qué información puedes compartirme?"
			assistantState="happy"
			assistantSize="xl"
			enableSequence={true}
			showBackButton={false}
			onBack={onBack}
		>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.6 }}
				className="flex flex-col justify-center gap-6 w-full max-w-2xl mx-auto px-4 py-1 min-h-full"
			>
				<TrainingSourcesHeader />

				<div className="space-y-2">
					{TRAINING_SOURCES.map((source, index) => {
						const isAdded = selectedSources.includes(source.type);
						const isExpanded = expandedCard === source.type;

						if (expandedCard && !isExpanded) {
							return null;
						}

						return (
							<TrainingSourceCard
								key={source.type}
								type={source.type}
								icon={source.icon}
								label={source.label}
								description={source.desc}
								showRecommendedTag={index === 0 && !isAdded}
								isAdded={isAdded}
								isExpanded={isExpanded}
								websiteUrl={websiteUrl}
								isWebsiteUrlValid={isWebsiteUrlValid}
								websiteValidationMessage={websiteValidationMessage}
								textInput={textInput}
								uploadedFiles={uploadedFiles}
								onToggleExpand={handleToggleExpand}
								onWebsiteChange={setWebsiteUrl}
								onTextChange={setTextInput}
								onAddWebsite={handleAddWebsite}
								onAddText={handleAddText}
								onUploadFiles={handleUploadFiles}
								onRemoveFile={handleRemoveFile}
							/>
						);
					})}
				</div>

				<ContinueButton
					isDisabled={selectedSources.length === 0 || isLoading}
					isLoading={isLoading}
					onPress={handleContinue}
				/>
			</motion.div>
		</TwoColumnLayoutAgent>
	);
};
