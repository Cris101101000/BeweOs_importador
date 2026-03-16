/**
 * Content Creation Step (Step 4)
 * Handles both AI-generated and manual content creation
 */

import { H3, H4, P, Textarea, Button, IconComponent, Select, SelectItem, Image } from "@beweco/aurora-ui";
import { UploadFileComponent } from '@shared/ui/components';
import { BrandConfigSection } from '../sections/BrandConfigSection';
import type { BrandConfig } from '../types';
import type { ITemplate } from '@campaigns/domain';

interface ContentCreationStepProps {
  useAI: boolean;
  isStory: boolean;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  generatedImage: string;
  generatedCaption: string;
  onGenerate: () => void;
  onImageUpload: (file: File) => void;
  onCaptionChange: (caption: string) => void;
  isGenerating: boolean;
  brandConfig: BrandConfig;
  onBrandConfigChange: (config: Partial<BrandConfig>) => void;
  isBrandConfigOpen: boolean;
  onBrandConfigToggle: () => void;
  selectedTemplate: ITemplate | null;
  onBack: () => void;
  onNext?: () => void;
  // Logo props
  onLogoUpload?: (files: File[]) => void;
  onLogoRemove?: () => void;
  isUploadingLogo?: boolean;
}

export function ContentCreationStep({
  useAI,
  isStory,
  prompt,
  onPromptChange,
  selectedCategory,
  onCategoryChange,
  generatedImage,
  generatedCaption,
  onGenerate,
  onImageUpload,
  onCaptionChange,
  isGenerating,
  brandConfig,
  onBrandConfigChange,
  isBrandConfigOpen,
  onBrandConfigToggle,
  selectedTemplate,
  onBack,
  onNext,
  onLogoUpload,
  onLogoRemove,
  isUploadingLogo = false,
}: ContentCreationStepProps) {
  // AI Prompt Mode
  if (useAI) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <H3>Describe el contenido que quieres crear y Linda lo generará por ti</H3>
          <P className="text-sm text-default-500 mt-2">
            Personaliza tu marca antes de generar para obtener mejores resultados
          </P>
        </div>

        {/* Brand Config Section */}
        <BrandConfigSection
          brandConfig={brandConfig}
          onChange={onBrandConfigChange}
          isOpen={isBrandConfigOpen}
          onToggle={onBrandConfigToggle}
          onLogoUpload={onLogoUpload}
          onLogoRemove={onLogoRemove}
          isUploadingLogo={isUploadingLogo}
        />

        {/* Prompt Input */}
        <div>
          <Textarea
            label="Describe el contenido que deseas crear"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPromptChange(e.target.value)}
            placeholder="Ej: Una campaña de WhatsApp sobre los beneficios del ejercicio matutino, con un tono motivacional y colores vibrantes..."
            minRows={6}
            isDisabled={isGenerating}
          />
        </div>

        {/* Spacer */}
        <div className="h-6"></div>

        {/* Category Selector - Only when no template */}
        <div>
          <Select
            label="Categoría del contenido"
            placeholder="Selecciona una categoría"
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onCategoryChange(selected || "");
            }}
            variant="flat"
            size="md"
            isDisabled={!!selectedTemplate}
            description={selectedTemplate ? "La categoría viene de la plantilla seleccionada" : undefined}
          >
            <SelectItem key="promocion">Promoción / Oferta</SelectItem>
            <SelectItem key="informativo">Informativo</SelectItem>
            <SelectItem key="recordatorio">Recordatorio</SelectItem>
            <SelectItem key="bienvenida">Bienvenida</SelectItem>
            <SelectItem key="seguimiento">Seguimiento</SelectItem>
            <SelectItem key="fidelizacion">Fidelización</SelectItem>
            <SelectItem key="evento">Evento</SelectItem>
            <SelectItem key="encuesta">Encuesta / Feedback</SelectItem>
            <SelectItem key="otro">Otro</SelectItem>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between space-x-3 pt-4">
          <Button
            variant="light"
            size="md"
            onPress={onBack}
          >
            Atrás
          </Button>
          <Button
            onPress={onGenerate}
            isDisabled={!prompt.trim() || isGenerating}
            color="primary"
            variant="solid"
            size="md"
            startContent={<IconComponent icon="solar:magic-stick-bold" />}
          >
            {isGenerating ? "Generando..." : "Generar contenido"}
          </Button>
        </div>
      </div>
    );
  }

  // Manual Content Upload Mode
  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="text-center mb-8">
        <H3>Sube tu contenido</H3>
        <P>Proporciona tu imagen y texto para crear tu publicación</P>
      </div>

      {/* Upload Image */}
      <div>
        <H4 className="mb-2">Imagen</H4>
        <UploadFileComponent
          acceptedFiles="image/*"
          maxFiles={1}
          size="large"
          text="Subir imagen"
          subText="PNG, JPG hasta 10MB"
          onUpload={(files) => {
            if (files.length > 0) {
              onImageUpload(files[0]);
            }
          }}
          onError={(error) => console.error('Upload error:', error)}
        />
        {generatedImage && (
          <div className="mt-4 flex justify-center">
            <Image 
              src={generatedImage} 
              alt="Imagen subida" 
              className="w-full max-w-[200px] h-[200px] object-cover rounded-lg border-2 border-gray-200"
            />
          </div>
        )}
      </div>

      {/* Text Input - Available for Posts and Stories */}
      <div>
        <Textarea
          label={
            <span>
              {isStory ? "Texto del story (opcional)" : "Texto del contenido"}
              {!isStory && <span className="text-red-500 ml-1">*</span>}
            </span>
          }
          value={generatedCaption}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCaptionChange(e.target.value)}
          placeholder={isStory ? "Añade texto a tu story (opcional)..." : "Escribe el texto de tu publicación..."}
          minRows={6}
        />
        {isStory && (
          <P className="text-xs text-gray-500 mt-1">
            El texto se superpondrá sobre la imagen de tu story
          </P>
        )}
      </div>

      {/* Category Selector */}
      <div className="pt-2">
        <Select
          label="Categoría del contenido"
          placeholder="Selecciona una categoría"
          selectedKeys={selectedCategory ? [selectedCategory] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onCategoryChange(selected || "");
          }}
          variant="flat"
          size="md"
          isDisabled={!!selectedTemplate}
          description={selectedTemplate ? "La categoría viene de la plantilla seleccionada" : undefined}
        >
          <SelectItem key="promocion">Promoción / Oferta</SelectItem>
          <SelectItem key="informativo">Informativo</SelectItem>
          <SelectItem key="recordatorio">Recordatorio</SelectItem>
          <SelectItem key="bienvenida">Bienvenida</SelectItem>
          <SelectItem key="seguimiento">Seguimiento</SelectItem>
          <SelectItem key="fidelizacion">Fidelización</SelectItem>
          <SelectItem key="evento">Evento</SelectItem>
          <SelectItem key="encuesta">Encuesta / Feedback</SelectItem>
          <SelectItem key="otro">Otro</SelectItem>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between space-x-3 pt-4">
        <Button
          variant="light"
          size="md"
          onPress={onBack}
        >
          Atrás
        </Button>
        {onNext && (
          <Button
            onPress={onNext}
            isDisabled={
              isStory 
                ? !generatedImage // Story requires image
                : !generatedCaption.trim() // Post/WhatsApp requires text
            }
            color="primary"
            variant="solid"
            size="md"
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
