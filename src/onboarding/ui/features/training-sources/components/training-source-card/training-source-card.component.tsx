import {
	Button,
	Card,
	CardBody,
} from "@beweco/aurora-ui";
import type { TrainingSourceType } from "../../hooks";
import { motion } from "framer-motion";
import { CollapsedCardContent } from "../collapsed-card-content";
import { WebsiteSourceForm } from "../website-source-form";
import { FilesSourceForm } from "../files-source-form";
import { TextSourceForm } from "../text-source-form";

interface TrainingSourceCardProps {
	type: TrainingSourceType;
	icon: string;
	label: string;
	description: string;
	showRecommendedTag?: boolean;
	isAdded: boolean;
	isExpanded: boolean;
	websiteUrl: string;
	isWebsiteUrlValid: boolean;
	websiteValidationMessage?: string;
	textInput: string;
	uploadedFiles: File[];
	onToggleExpand: (type: TrainingSourceType) => void;
	onWebsiteChange: (value: string) => void;
	onTextChange: (value: string) => void;
	onAddWebsite: () => void;
	onAddText: () => void;
	onUploadFiles: (files: File[]) => void;
	onRemoveFile: (index: number) => void;
}

export const 
TrainingSourceCard = ({
	type,
	icon,
	label,
	description,
	showRecommendedTag = false,
	isAdded,
	isExpanded,
	websiteUrl,
	isWebsiteUrlValid,
	websiteValidationMessage,
	textInput,
	uploadedFiles,
	onToggleExpand,
	onWebsiteChange,
	onTextChange,
	onAddWebsite,
	onAddText,
	onUploadFiles,
	onRemoveFile,
}: TrainingSourceCardProps) => {
	const cardDescription =
		type === "website" && isAdded && websiteUrl.trim()
			? websiteUrl
			: type === "text" && isAdded && textInput.trim()
				? textInput.length > 60
					? `${textInput.slice(0, 60)}...`
					: textInput
				: description;

	return (
		<div className="relative">
			{showRecommendedTag ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.8, x: 10, y: -10 }}
					animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
					transition={{ delay: 0.5, duration: 0.4 }}
					className="absolute -top-2 -right-2 z-10"
				>
					<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
						<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						<span>Recomendado</span>
					</div>
				</motion.div>
			) : null}
			<Card
				shadow="md"
				className={`w-full transition-all duration-300 border rounded-2xl ${
					isExpanded ? "" : "hover:scale-[1.02]"
				} ${
					isAdded
						? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
						: "bg-white dark:bg-content1 border-gray-200"
				} ${showRecommendedTag ? "ring-2 ring-blue-500/30" : ""}`}
			>
				<CardBody className="px-4 py-2">
					<div className="space-y-2">
						{isExpanded ? (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
								className="py-2 space-y-4"
							>
								<div className="flex justify-start">
									<Button
										variant="light"
										size="sm"
										onPress={() => onToggleExpand(type)}
										className="text-blue-500 font-medium p-0 bg-transparent min-w-0"
										startContent={
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
											</svg>
										}
									>
										Atrás
									</Button>
								</div>

								{type === "website" ? (
									<WebsiteSourceForm
										websiteUrl={websiteUrl}
										isWebsiteUrlValid={isWebsiteUrlValid}
										websiteValidationMessage={websiteValidationMessage}
										onWebsiteChange={onWebsiteChange}
										onAddWebsite={onAddWebsite}
									/>
								) : null}

								{type === "files" ? (
									<FilesSourceForm
										uploadedFiles={uploadedFiles}
										onUploadFiles={onUploadFiles}
										onRemoveFile={onRemoveFile}
									/>
								) : null}

								{type === "text" ? (
									<TextSourceForm
										textInput={textInput}
										onTextChange={onTextChange}
										onAddText={onAddText}
									/>
								) : null}
							</motion.div>
						) : null}

						{!isExpanded ? (
							<CollapsedCardContent
								type={type}
								icon={icon}
								label={label}
								cardDescription={cardDescription}
								isAdded={isAdded}
								uploadedFiles={uploadedFiles}
								onToggleExpand={onToggleExpand}
								onRemoveFile={onRemoveFile}
							/>
						) : null}
					</div>
				</CardBody>
			</Card>
		</div>
	);
};
