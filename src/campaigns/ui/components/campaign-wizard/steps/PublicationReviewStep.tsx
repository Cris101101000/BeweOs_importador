/**
 * Publication Review Step (Step 5)
 * Final review and editing before publication
 */

import { H4, Card, Button, IconComponent, Input, Tooltip } from "@beweco/aurora-ui";
import { PreviewSection } from '../sections/PreviewSection';
import { EditImageSection } from '../sections/EditImageSection';
import { EditTextSection } from '../sections/EditTextSection';
import { EditCTASection } from '../sections/EditCTASection';
import type { CTAConfig } from '../types';

interface WhatsAppCtaType {
  key: string;
  label: string;
  requiresPhone: boolean;
}

interface PublicationReviewStepProps {
  campaignTitle: string;
  onTitleChange: (title: string) => void;
  generatedImage: string;
  generatedCaption: string;
  onImageChange: (image: string) => void;
  onCaptionChange: (caption: string) => void;
  selectedContentType: string;
  ctaConfig: CTAConfig;
  onCTAChange: (config: Partial<CTAConfig>) => void;
  whatsappCtaTypes: WhatsAppCtaType[];
  isStory: boolean;
  
  // Image editing
  imageEditMode: 'upload' | 'ai';
  onImageEditModeChange: (mode: 'upload' | 'ai') => void;
  isImageEditOpen: boolean;
  onImageEditToggle: () => void;
  editPrompt: string;
  onEditPromptChange: (prompt: string) => void;
  onGenerateImage: () => void;
  onEditImage: () => void;
  onImageUpload: (file: File) => void;
  
  // Text editing
  isTextEditOpen: boolean;
  onTextEditToggle: () => void;
  editCaptionPrompt: string;
  onEditCaptionPromptChange: (prompt: string) => void;
  onEditCaption: () => void;
  
  // CTA
  isCtaOpen: boolean;
  onCtaToggle: () => void;
  
  isGenerating: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function PublicationReviewStep({
  campaignTitle,
  onTitleChange,
  generatedImage,
  generatedCaption,
  onImageChange,
  onCaptionChange,
  selectedContentType,
  ctaConfig,
  onCTAChange,
  whatsappCtaTypes,
  isStory,
  imageEditMode,
  onImageEditModeChange,
  isImageEditOpen,
  onImageEditToggle,
  editPrompt,
  onEditPromptChange,
  onGenerateImage,
  onEditImage,
  onImageUpload,
  isTextEditOpen,
  onTextEditToggle,
  editCaptionPrompt,
  onEditCaptionPromptChange,
  onEditCaption,
  isCtaOpen,
  onCtaToggle,
  isGenerating,
  onBack,
  onNext,
}: PublicationReviewStepProps) {
  const ctaLabel = ctaConfig.type ? whatsappCtaTypes.find(c => c.key === ctaConfig.type)?.label : undefined;

  return (
    <div className="space-y-4 w-full">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Revisión Final y Edición</h2>
      </div>

      {/* Responsive Layout: 1 column on mobile, 2 columns from tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        
        {/* LEFT COLUMN: Preview */}
        <div>
          <PreviewSection
            selectedContentType={selectedContentType}
            generatedImage={generatedImage}
            generatedCaption={generatedCaption}
            ctaType={ctaConfig.type}
            ctaValue={ctaConfig.value}
            ctaLabel={ctaLabel}
          />
        </div>

        {/* RIGHT COLUMN: Edit Controls */}
        <div className="space-y-1">
          
          {/* Campaign Name Section - ALWAYS VISIBLE */}
          <Card className="shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconComponent icon="solar:text-bold" className="text-lg text-primary-600" />
              <H4 className="text-sm">Nombre de la Campaña</H4>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Nombre <span className="text-danger">*</span></span>
                  <Tooltip 
                    content="Este título es solo para gestión interna y no afectará la visualización de la campaña ni del contenido en redes sociales."
                    placement="top"
                    className="max-w-xs"
                  >
                    <span className="cursor-help">
                      <IconComponent icon="solar:info-circle-outline" className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                    </span>
                  </Tooltip>
                </div>
                <Input
                  value={campaignTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Nombre de tu campaña..."
                  variant="flat"
                  size="md"
                />
              </div>
              <p className="text-xs text-gray-500">
                Este nombre te ayudará a identificar la campaña en tu historial
              </p>
            </div>
          </Card>

          {/* Edit Image Section - COLLAPSIBLE */}
          <EditImageSection
            isOpen={isImageEditOpen}
            onToggle={onImageEditToggle}
            imageEditMode={imageEditMode}
            onImageEditModeChange={onImageEditModeChange}
            generatedImage={generatedImage}
            onImageChange={onImageChange}
            editPrompt={editPrompt}
            onEditPromptChange={onEditPromptChange}
            onGenerateImage={onGenerateImage}
            onEditImage={onEditImage}
            onImageUpload={onImageUpload}
            isGenerating={isGenerating}
          />

          {/* Edit Text Section - COLLAPSIBLE */}
          <EditTextSection
            isOpen={isTextEditOpen}
            onToggle={onTextEditToggle}
            generatedCaption={generatedCaption}
            onCaptionChange={onCaptionChange}
            editCaptionPrompt={editCaptionPrompt}
            onEditCaptionPromptChange={onEditCaptionPromptChange}
            onEditCaption={onEditCaption}
            isGenerating={isGenerating}
            isStory={isStory}
          />

          {/* Edit CTA Section - COLLAPSIBLE */}
          <EditCTASection
            isOpen={isCtaOpen}
            onToggle={onCtaToggle}
            ctaConfig={ctaConfig}
            onCTAChange={onCTAChange}
            whatsappCtaTypes={whatsappCtaTypes}
          />
        </div>
      </div>

      {/* Action Buttons - At the end */}
      <div className="flex justify-between space-x-3 pt-6 max-w-7xl mx-auto">
        <Button
          variant="light"
          size="md"
          onPress={onBack}
        >
          Atrás
        </Button>
        <Button
          onPress={onNext}
          color="primary"
          variant="solid"
          size="md"
          isDisabled={!campaignTitle.trim()}
          endContent={<IconComponent icon="solar:arrow-right-outline" className="text-base" />}
        >
          Siguiente: Definir Alcance
        </Button>
      </div>
    </div>
  );
}
