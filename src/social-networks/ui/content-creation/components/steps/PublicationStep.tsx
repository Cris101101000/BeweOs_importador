/**
 * Publication Step (Step 5)
 * Preview and publish the content
 */

import { useState } from "react";
import { H3, H4, P, Button, Input, IconComponent } from "@beweco/aurora-ui";
import { StepContainer } from "@shared/ui/components/StepContainer";
import { VariableTextarea } from "@shared/ui/components/VariableTextarea";
import { SocialMediaPreviewComponent } from "@shared/ui/components";
import { EditImageModal } from "../EditImageModal";

interface PublicationStepProps {
	isStory: boolean;
	generatedImage: string;
	displayCaption: string;
	generatedCaption: string;
	contentTitle: string;
	onContentTitleChange: (title: string) => void;
	onCaptionChange: (caption: string) => void;
	isPublishing: boolean;
	canGoBack: boolean;
	onBack: () => void;
	onPublish: () => void;
	useAI: boolean | null;
	contentId: string | null;
	onEditImage: (prompt: string, imageUrls: string[]) => Promise<void>;
	isEditingImage?: boolean;
}

export function PublicationStep({
	isStory,
	generatedImage,
	displayCaption,
	generatedCaption,
	contentTitle,
	onContentTitleChange,
	onCaptionChange,
	isPublishing,
	canGoBack,
	onBack,
	onPublish,
	useAI,
	onEditImage,
	isEditingImage = false,
}: PublicationStepProps) {
	const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);

	const handleEditImageClick = () => {
		setIsEditImageModalOpen(true);
	};

	const handleEditImage = async (prompt: string, imageUrls: string[]) => {
		try {
			await onEditImage(prompt, imageUrls);
			setIsEditImageModalOpen(false);
		} catch (error) {
			console.error("Error en handleEditImage:", error);
		}
	};

	return (
		<StepContainer
			className="max-w-7xl"
			footerClassName="bg-background dark:bg-background sticky bottom-0 z-10"
			header={
				<div className="text-center">
					<H3>Revisa y publica tu contenido</H3>
					<P>Ajusta los detalles finales antes de publicar</P>
				</div>
			}
			footer={
				<>
					{canGoBack && (
						<Button
							variant="light"
							size="md"
							onPress={onBack}
							isDisabled={isPublishing}
						>
							Atrás
						</Button>
					)}
					<Button
						onPress={onPublish}
						color="primary"
						variant="solid"
						size="md"
						isDisabled={!contentTitle.trim() || isPublishing}
						isLoading={isPublishing}
						endContent={
							!isPublishing && (
								<IconComponent icon="solar:plain-3-bold" className="text-base" />
							)
						}
					>
						{isPublishing ? "Procesando y publicando..." : "Publicar Contenido"}
					</Button>
				</>
			}
		>
			{/* Preview and Edit Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-350px)] max-h-[700px]">
				{/* Preview */}
				<div className="overflow-y-auto h-full pr-2">
					<div className="sticky top-0 bg-background dark:bg-background z-20 pb-3 mb-4 border-b border-divider">
						<H4 className="py-2">Vista previa</H4>
					</div>
					<div
						className={isStory ? "flex justify-center items-start py-4" : ""}
					>
						<div
							className={
								isStory
									? "w-full max-w-[320px] px-4"
									: "w-full max-w-[420px] mx-auto"
							}
						>
							<SocialMediaPreviewComponent
								platform="instagram"
								imageUrl={generatedImage}
								caption={displayCaption}
								variant={isStory ? "story" : "full"}
								showHeader={true}
								showEditButton={useAI === true}
								onEditClick={handleEditImageClick}
							/>
						</div>
					</div>
				</div>

				{/* Edit Section */}
				<div className="space-y-4 overflow-y-auto h-full pr-2">
					<div className="sticky top-0 bg-background dark:bg-background z-20 pb-3 mb-4 border-b border-divider">
						<H4 className="py-2">Detalles</H4>
					</div>
					<div className="space-y-4">
						<div>
							<Input
								label="Título del contenido"
								placeholder="Dale un nombre a tu publicación"
								value={contentTitle}
								onValueChange={onContentTitleChange}
								isRequired
							/>
						</div>

						{/* Solo mostrar descripción si NO es story */}
						{!isStory && (
							<div>
								<VariableTextarea
									label="Descripción"
									placeholder="Edita el texto de tu publicación"
									value={generatedCaption}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										onCaptionChange(e.target.value)
									}
									minRows={6}
									showHint={true}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Edit Image Modal */}
			<EditImageModal
				isOpen={isEditImageModalOpen}
				onClose={() => setIsEditImageModalOpen(false)}
				onEdit={handleEditImage}
				isLoading={isEditingImage}
			/>
		</StepContainer>
	);
}
