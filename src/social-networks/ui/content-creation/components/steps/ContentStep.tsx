/**
 * Content Step (Step 4)
 * Handles both AI-generated and manual content creation
 */

import { H3, H4, P, Button, Textarea } from "@beweco/aurora-ui";
import { StepContainer } from "@shared/ui/components/StepContainer";
import { UploadFileComponent } from "@shared/ui/components/UploadFile/UploadFile";
import { ImagePreviewComponent } from "@shared/ui/components/ImagePreview";
import { BrandConfigSection } from "@campaigns/ui/components/campaign-wizard/sections/BrandConfigSection";
import type { BrandConfig } from "@shared/ui/components";

interface ContentStepProps {
	useAI: boolean;
	isStory: boolean;
	// AI props
	prompt: string;
	onPromptChange: (prompt: string) => void;
	isGenerating: boolean;
	onGenerate: () => void;
	// Brand config props (for AI flow)
	brandConfig: BrandConfig;
	onBrandConfigChange: (config: Partial<BrandConfig>) => void;
	isBrandConfigOpen: boolean;
	onBrandConfigToggle: () => void;
	// Logo upload handlers
	onLogoUpload?: (files: File[]) => void;
	onLogoRemove?: () => void;
	isUploadingLogo?: boolean;
	onLogoError?: (error: string) => void;
	// Manual props
	generatedImage: string;
	generatedCaption: string;
	onImageUpload: (files: File[]) => void;
	onImageRemove: () => void;
	onCaptionChange: (caption: string) => void;
	isUploadingToFilestack: boolean;
	// Navigation
	onBack: () => void;
	onNext: () => void;
}

export function ContentStep({
	useAI,
	isStory,
	prompt,
	onPromptChange,
	isGenerating,
	onGenerate,
	brandConfig,
	onBrandConfigChange,
	isBrandConfigOpen,
	onBrandConfigToggle,
	onLogoUpload,
	onLogoRemove,
	isUploadingLogo = false,
	onLogoError,
	generatedImage,
	generatedCaption,
	onImageUpload,
	onImageRemove,
	onCaptionChange,
	isUploadingToFilestack,
	onBack,
	onNext,
}: ContentStepProps) {
	// AI Flow
	if (useAI) {
		return (
			<StepContainer
				header={
					<div className="text-center">
						<H3>
							Describe el contenido que quieres crear y Linda lo generará por ti
						</H3>
						<P className="text-sm text-default-500 mt-2">
							Personaliza tu marca antes de generar para obtener mejores
							resultados
						</P>
					</div>
				}
				footer={
					<>
						<Button variant="light" size="md" onPress={onBack}>
							Atrás
						</Button>
						<Button
							onPress={onGenerate}
							isDisabled={!prompt.trim() || isGenerating}
							color="primary"
							variant="solid"
							size="md"
						>
							{isGenerating ? "Generando..." : "Generar contenido"}
						</Button>
					</>
				}
			>
				<div className="space-y-6">
					<BrandConfigSection
						brandConfig={brandConfig}
						onChange={onBrandConfigChange}
						isOpen={isBrandConfigOpen}
						onToggle={onBrandConfigToggle}
						onLogoUpload={onLogoUpload}
						onLogoRemove={onLogoRemove}
						isUploadingLogo={isUploadingLogo}
						onLogoError={onLogoError}
						isReadOnly={false}
					/>
					<Textarea
						value={prompt}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							onPromptChange(e.target.value)
						}
						placeholder="Ej: Un post sobre los beneficios del ejercicio matutino, con colores vibrantes y motivacionales..."
						minRows={6}
						isDisabled={isGenerating}
					/>
				</div>
			</StepContainer>
		);
	}

	// Manual Flow
	return (
		<StepContainer
			header={
				<div className="text-center">
					<H3>Sube tu contenido</H3>
					<P>Proporciona tu imagen y texto para crear tu publicación</P>
				</div>
			}
			footer={
				<>
					<Button
						variant="light"
						size="md"
						onPress={onBack}
						isDisabled={isUploadingToFilestack}
					>
						Atrás
					</Button>
					<Button
						onPress={onNext}
						isDisabled={
							!generatedImage ||
							(!isStory && !generatedCaption.trim()) ||
							isUploadingToFilestack
						}
						isLoading={isUploadingToFilestack}
						color="primary"
						variant="solid"
						size="md"
					>
						{isUploadingToFilestack ? "Procesando imagen..." : "Siguiente"}
					</Button>
				</>
			}
		>
			{/* Upload Image */}
			<div>
				<H4 className="mb-2">Imagen</H4>
				{!generatedImage ? (
					<UploadFileComponent
						acceptedFiles="image/png,image/jpeg,image/jpg"
						maxFiles={1}
						size="large"
						text="Sube tu imagen"
						subText="Formatos: PNG, JPEG, JPG"
						onUpload={onImageUpload}
						icon="solar:upload-bold"
					/>
				) : (
					<div className="flex justify-center">
						<ImagePreviewComponent
							images={generatedImage}
							size="large"
							onRemove={onImageRemove}
							showRemoveButton={true}
							radius="lg"
							showBorder={true}
						/>
					</div>
				)}
			</div>

			{/* Text Input */}
			<div>
				<Textarea
					label={isStory ? "Texto del story (opcional)" : "Texto del contenido"}
					value={generatedCaption}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						onCaptionChange(e.target.value)
					}
					placeholder={
						isStory
							? "Añade texto a tu story (opcional)..."
							: "Escribe el texto de tu publicación..."
					}
					minRows={6}
				/>
			</div>
		</StepContainer>
	);
}
