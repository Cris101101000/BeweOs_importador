/**
 * Create Campaign Wizard Page
 * Refactored to use Wizard component with modular steps
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  Card,
  CardBody,
  IconComponent,
} from "@beweco/aurora-ui";
import { Wizard, type WizardStep, type WizardStepValidation } from "@shared/ui/components/wizard";
// TODO: Habilitar cuando se instale @beweco/email-template-builder
// import { EmailTemplateBuilder, type CustomVariable } from '@shared/ui/components';
type CustomVariable = { name: string; value: string };
const EmailTemplateBuilder = (_props: Record<string, unknown>) => null;
import { useCampaignAudience } from '../features/audience/hooks/useCampaignAudience';
import { useCampaignTemplates } from '../features/templates/hooks/useCampaignTemplates';
import { useCampaignWizard } from '../features/campaign-management/hooks/useCampaignWizard.hook';
import { useTranslate } from '@tolgee/react';
import type { EditState } from '../components/campaign-wizard/types';

// Import steps
import {
  ChannelSelectionStep,
  TemplateSelectionStep,
  ContentOptionsStep,
  ContentCreationStep,
  PublicationReviewStep,
  AudienceReachStep,
} from '../components/campaign-wizard/steps';

// Import modals
import { ImageRegenerateModal } from '../components/campaign-wizard/modals/ImageRegenerateModal';

// Inject CSS animations for typewriter effect
const typewriterStyle = document.createElement("style");
typewriterStyle.textContent = `
  @keyframes typewriter {
    0% {
      opacity: 0;
      transform: translateY(8px) scale(0.95);
      filter: blur(2px);
    }
    50% {
      opacity: 0.7;
      transform: translateY(2px) scale(0.98);
      filter: blur(0.5px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }
  
  @keyframes fadeSlideIn {
    0% {
      opacity: 0;
      transform: translateY(15px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
if (
	typeof document !== "undefined" &&
	!document.head.querySelector("#typewriter-animations")
) {
	typewriterStyle.id = "typewriter-animations";
	document.head.appendChild(typewriterStyle);
}

export function CreateCampaignPage() {
  const location = useLocation();
  const { t } = useTranslate();
  const navigate = useNavigate();

  // Get edit state from location
  const editState = location.state as EditState | null;

  // Check sessionStorage for template/campaign data as backup
  const getInitialState = () => {
    if (editState?.currentStep) {
      return editState;
    }
    
    // Check for template data
    const storedTemplate = sessionStorage.getItem('selectedTemplate');
    if (storedTemplate) {
      try {
        const parsed = JSON.parse(storedTemplate);
        sessionStorage.removeItem('selectedTemplate');
        return parsed;
      } catch (e) {
        console.error('Error parsing template sessionStorage:', e);
      }
    }
    
    // Check for repeat campaign data
    const storedCampaign = sessionStorage.getItem('repeatCampaign');
    if (storedCampaign) {
      try {
        const parsed = JSON.parse(storedCampaign);
        sessionStorage.removeItem('repeatCampaign');
        return parsed;
      } catch (e) {
        console.error('Error parsing campaign sessionStorage:', e);
      }
    }
    
    return editState;
  };

  const initialState = getInitialState();

  // Hooks for data from application layer
  const {
    statuses,
    savedViews,
    totalClientsCount,
    loadAudienceData,
    getTagsWithAdditional
  } = useCampaignAudience();

  const {
    templates,
    whatsappCtaTypes,
    isLoading: isLoadingTemplates,
    loadAllCampaignData
  } = useCampaignTemplates();

  // Central wizard state management
  const wizardState = useCampaignWizard(initialState);

  // Current step
  const [currentStep, setCurrentStep] = useState(initialState?.currentStep || 1);

  // Load audience data on mount
  useEffect(() => {
    loadAudienceData();
  }, [loadAudienceData]);

  // Load templates and data when channel is selected
  useEffect(() => {
    if (wizardState.selectedContentType) {
      loadAllCampaignData(wizardState.selectedContentType as any);
    }
  }, [wizardState.selectedContentType, loadAllCampaignData]);

  // Get available tags (combining with required tags if proposed campaign)
  const availableTags = getTagsWithAdditional(editState?.requiredTags);

  // Calculate estimated reach for custom logic
  const calculateEstimatedReach = () => {
    if (editState?.isProposedCampaign && editState?.targetAudienceCount) {
      const requiredTagsSet = new Set(editState.requiredTags || []);
      const selectedTagsSet = new Set(wizardState.selectedTags);
      
      if (wizardState.selectedStatuses.length === 0 && 
          requiredTagsSet.size > 0 && 
          Array.from(requiredTagsSet).every(tag => selectedTagsSet.has(tag))) {
        return editState.targetAudienceCount;
      }
      
      if (wizardState.selectedStatuses.length === 0 && 
          wizardState.selectedTags.length === requiredTagsSet.size &&
          wizardState.selectedTags.every(tag => requiredTagsSet.has(tag))) {
        return editState.targetAudienceCount;
      }
    }
    
    if (wizardState.selectedStatuses.length === 0 && wizardState.selectedTags.length === 0) return 0;

    const statusCount = wizardState.selectedStatuses.reduce((sum: number, statusValue: string) => {
      const status = statuses.find((s: any) => s.value === statusValue);
      return sum + (status?.count || 0);
    }, 0);

    const tagCount = wizardState.selectedTags.reduce((sum, tagValue) => {
      const tag = availableTags.find(t => t.value === tagValue);
      return sum + (tag?.count || 0);
    }, 0);

    if (wizardState.logicOperator === "or") {
      return Math.floor((statusCount + tagCount) * 0.9);
    } else {
      return Math.floor(Math.min(statusCount, tagCount) * 0.3);
    }
  };

  const estimatedReach = calculateEstimatedReach();

  // Check if email channel is selected
  const isEmailChannel = wizardState.selectedContentType === "email";
  
  // Check if WhatsApp has a template selected (short flow)
  const isWhatsAppWithTemplate = !isEmailChannel && wizardState.selectedTemplate !== null;

  // Wizard steps configuration - dynamic based on selected channel and template
  const getWizardSteps = (): WizardStep[] => {
    // Email: always short flow (Canal, Plantilla, Alcance)
    if (isEmailChannel) {
      return [
        { number: 1, title: "Canal" },
        { number: 2, title: "Plantilla" },
        { number: 3, title: "Alcance" },
      ];
    }
    
    // WhatsApp with template: short flow (Canal, Plantilla, Alcance)
    if (isWhatsAppWithTemplate) {
      return [
        { number: 1, title: "Canal" },
        { number: 2, title: "Plantilla" },
        { number: 3, title: "Alcance" },
      ];
    }
    
    // WhatsApp without template: full flow
    return [
      { number: 1, title: "Canal" },
      { number: 2, title: "Plantilla" },
      { number: 3, title: "Opciones" },
      { number: 4, title: wizardState.step4Title },
      { number: 5, title: "Publicación" },
      { number: 6, title: "Alcance" },
    ];
  };

  const steps = getWizardSteps();
  
  // Check if we're in short flow mode (3 steps)
  const isShortFlow = isEmailChannel || isWhatsAppWithTemplate;

  // Wizard validations - dynamic based on flow type
  const wizardValidations: WizardStepValidation[] = isShortFlow
    ? [
        {
          stepNumber: 1,
          canProceed: () => wizardState.selectedContentType !== "",
          errorMessage: "Debes seleccionar un canal"
        },
        {
          stepNumber: 3, // Alcance for short flow
          canProceed: () => {
            if (wizardState.selectedReachType === "saved-view") return wizardState.selectedView !== "";
            if (wizardState.selectedReachType === "custom-logic") {
              return wizardState.selectedStatuses.length > 0 || wizardState.selectedTags.length > 0;
            }
            return true;
          },
          errorMessage: "Debes definir el alcance de la campaña"
        }
      ]
    : [
        {
          stepNumber: 1,
          canProceed: () => wizardState.selectedContentType !== "",
          errorMessage: "Debes seleccionar un canal"
        },
        {
          stepNumber: 4,
          canProceed: () => {
            if (wizardState.useAI) {
              return wizardState.prompt.trim() !== "" || wizardState.generatedImage !== "";
            }
            return wizardState.isStory ? wizardState.generatedImage !== "" : wizardState.generatedCaption.trim() !== "";
          },
          errorMessage: "Debes completar el contenido requerido"
        },
        {
          stepNumber: 5,
          canProceed: () => wizardState.campaignTitle.trim() !== "",
          errorMessage: "Debes asignar un nombre a la campaña"
        },
        {
          stepNumber: 6,
          canProceed: () => {
            if (wizardState.selectedReachType === "saved-view") return wizardState.selectedView !== "";
            if (wizardState.selectedReachType === "custom-logic") {
              return wizardState.selectedStatuses.length > 0 || wizardState.selectedTags.length > 0;
            }
            return true;
          },
          errorMessage: "Debes definir el alcance de la campaña"
        }
      ];

  // Email Template Builder - Custom Variables
  const campaignVariables: CustomVariable[] = [
    {
      key: "user_name",
      name: t("campaigns_variable_user_name", "Nombre del Usuario"),
      description: t("campaigns_variable_user_name_desc", "El nombre del destinatario del email"),
      exampleValue: "Juan Pérez",
    },
    {
      key: "business_name",
      name: t("campaigns_variable_business_name", "Nombre del Negocio"),
      description: t("campaigns_variable_business_name_desc", "El nombre de tu negocio"),
      exampleValue: "Mi Negocio",
    },
    {
      key: "discount_code",
      name: t("campaigns_variable_discount_code", "Código de Descuento"),
      description: t("campaigns_variable_discount_code_desc", "Código de descuento para promociones"),
      exampleValue: "DESCUENTO20",
    },
    {
      key: "order_number",
      name: t("campaigns_variable_order_number", "Número de Orden"),
      description: t("campaigns_variable_order_number_desc", "Número de orden del cliente"),
      exampleValue: "#12345",
    },
    {
      key: "support_email",
      name: t("campaigns_variable_support_email", "Email de Soporte"),
      description: t("campaigns_variable_support_email_desc", "Email de contacto para soporte"),
      exampleValue: "soporte@minegocio.com",
    },
  ];

  // Navigation handlers
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleNextStep = () => {
    if (isShortFlow) {
      // Short flow (Email or WhatsApp with template): 1 -> 2 -> 3
      setCurrentStep(currentStep + 1);
    } else {
      // WhatsApp full flow: 1 -> 2 -> 3 -> 4 -> 5 -> 6
      if (currentStep === 4 && wizardState.useAI === true) {
        // For AI mode, after generating go directly to step 5
        setCurrentStep(5);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBackStep = () => {
    if (isShortFlow) {
      // Short flow: simple back
      setCurrentStep(currentStep - 1);
    } else {
      // WhatsApp full flow
      if (currentStep === 5 && wizardState.useAI === true) {
        // For AI mode, going back from step 5 to step 4
        setCurrentStep(4);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };


  return (
    <div className="space-y-5 -mt-2">
      {/* Back Button */}
      <Button
        variant="light"
        color="primary"
        size="sm"
        onPress={() => navigate('/campaigns')}
        startContent={
          <IconComponent
            icon="solar:alt-arrow-left-linear"
            className="text-primary"
            size="sm"
          />
        }
        className="w-fit font-medium hover:bg-primary-50 transition-all duration-200"
      >
        Volver
      </Button>

      {/* Content Card */}
      <Card>
        <CardBody className="p-0">
          <Wizard
            steps={steps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            renderStep={(step) => {
              // Short flow (Email or WhatsApp with template): 1 (Canal), 2 (Plantilla), 3 (Alcance)
              // Full flow (WhatsApp without template): 1-6 all steps
              
              if (isShortFlow) {
                switch (step.number) {
                  case 1:
                    return (
                      <ChannelSelectionStep
                        selectedContentType={wizardState.selectedContentType}
                        onSelectContentType={wizardState.setSelectedContentType}
                        onNext={handleNextStep}
                      />
                    );

                  case 2:
                    return (
                      <TemplateSelectionStep
                        selectedTemplate={wizardState.selectedTemplate}
                        onSelectTemplate={wizardState.handleSelectTemplate}
                        savedEmailTemplate={wizardState.savedEmailTemplate}
                        onOpenTemplateBuilder={() => wizardState.setIsTemplateBuilderOpen(true)}
                        onDeleteEmailTemplate={() => wizardState.setSavedEmailTemplate(null)}
                        templates={templates}
                        isLoading={isLoadingTemplates}
                        selectedContentType={wizardState.selectedContentType}
                        onBack={handleBackStep}
                        onNext={handleNextStep}
                      />
                    );

                  case 3:
                    // Short flow: step 3 is Alcance
                    return (
                      <AudienceReachStep
                        selectedReachType={wizardState.selectedReachType}
                        onReachTypeChange={wizardState.setSelectedReachType}
                        selectedView={wizardState.selectedView}
                        selectedStatuses={wizardState.selectedStatuses}
                        selectedTags={wizardState.selectedTags}
                        logicOperator={wizardState.logicOperator}
                        onViewChange={wizardState.setSelectedView}
                        onStatusesChange={wizardState.setSelectedStatuses}
                        onTagsChange={wizardState.setSelectedTags}
                        onLogicOperatorChange={wizardState.setLogicOperator}
                        estimatedReach={estimatedReach}
                        audienceData={{
                          tags: availableTags,
                          statuses,
                          savedViews,
                          totalClientsCount,
                        }}
                        editState={editState || undefined}
                        onBack={handleBackStep}
                        onPublish={wizardState.handleConfirmPublish}
                      />
                    );

                  default:
                    return null;
                }
              }
              
              // Full flow (WhatsApp without template): all steps
              switch (step.number) {
                case 1:
                  return (
                    <ChannelSelectionStep
                      selectedContentType={wizardState.selectedContentType}
                      onSelectContentType={wizardState.setSelectedContentType}
                      onNext={handleNextStep}
                    />
                  );

                case 2:
                  return (
                    <TemplateSelectionStep
                      selectedTemplate={wizardState.selectedTemplate}
                      onSelectTemplate={wizardState.handleSelectTemplate}
                      savedEmailTemplate={wizardState.savedEmailTemplate}
                      onOpenTemplateBuilder={() => wizardState.setIsTemplateBuilderOpen(true)}
                      onDeleteEmailTemplate={() => wizardState.setSavedEmailTemplate(null)}
                      templates={templates}
                      isLoading={isLoadingTemplates}
                      selectedContentType={wizardState.selectedContentType}
                      onBack={handleBackStep}
                      onNext={handleNextStep}
                    />
                  );

                case 3:
                  return (
                    <ContentOptionsStep
                      useAI={wizardState.useAI}
                      onSelectOption={wizardState.setUseAI}
                      selectedTemplate={wizardState.selectedTemplate}
                      selectedContentType={wizardState.selectedContentType}
                      onBack={handleBackStep}
                      onNext={handleNextStep}
                    />
                  );

                case 4:
                  return (
                    <ContentCreationStep
                      useAI={wizardState.useAI === true}
                      isStory={wizardState.isStory}
                      prompt={wizardState.prompt}
                      onPromptChange={wizardState.setPrompt}
                      selectedCategory={wizardState.selectedCategory}
                      onCategoryChange={wizardState.setSelectedCategory}
                      generatedImage={wizardState.generatedImage}
                      generatedCaption={wizardState.generatedCaption}
                      onGenerate={wizardState.handleGenerate}
                      onImageUpload={wizardState.handleImageUpload}
                      onCaptionChange={wizardState.setGeneratedCaption}
                      isGenerating={wizardState.isGenerating}
                      brandConfig={wizardState.brandConfig}
                      onBrandConfigChange={(config) => wizardState.setBrandConfig(prev => ({ ...prev, ...config }))}
                      isBrandConfigOpen={wizardState.isBrandConfigOpen}
                      onBrandConfigToggle={() => wizardState.setIsBrandConfigOpen(!wizardState.isBrandConfigOpen)}
                      selectedTemplate={wizardState.selectedTemplate}
                      onBack={handleBackStep}
                      onNext={handleNextStep}
                      onLogoUpload={wizardState.handleLogoUpload}
                      onLogoRemove={wizardState.handleLogoRemove}
                      isUploadingLogo={wizardState.isUploadingLogo}
                    />
                  );

                case 5:
                  return (
                    <PublicationReviewStep
                      campaignTitle={wizardState.campaignTitle}
                      onTitleChange={wizardState.setCampaignTitle}
                      generatedImage={wizardState.generatedImage}
                      generatedCaption={wizardState.generatedCaption}
                      onImageChange={wizardState.setGeneratedImage}
                      onCaptionChange={wizardState.setGeneratedCaption}
                      selectedContentType={wizardState.selectedContentType}
                      ctaConfig={wizardState.ctaConfig}
                      onCTAChange={(config) => wizardState.setCtaConfig(prev => ({ ...prev, ...config }))}
                      whatsappCtaTypes={whatsappCtaTypes}
                      isStory={wizardState.isStory}
                      imageEditMode={wizardState.imageEditMode}
                      onImageEditModeChange={wizardState.setImageEditMode}
                      isImageEditOpen={wizardState.isImageEditOpen}
                      onImageEditToggle={() => wizardState.setIsImageEditOpen(!wizardState.isImageEditOpen)}
                      editPrompt={wizardState.editPrompt}
                      onEditPromptChange={wizardState.setEditPrompt}
                      onGenerateImage={wizardState.handleGenerateImageWithAI}
                      onEditImage={wizardState.handleEditImage}
                      onImageUpload={wizardState.handleImageUpload}
                      isTextEditOpen={wizardState.isTextEditOpen}
                      onTextEditToggle={() => wizardState.setIsTextEditOpen(!wizardState.isTextEditOpen)}
                      editCaptionPrompt={wizardState.editCaptionPrompt}
                      onEditCaptionPromptChange={wizardState.setEditCaptionPrompt}
                      onEditCaption={wizardState.handleEditCaption}
                      isCtaOpen={wizardState.isCtaOpen}
                      onCtaToggle={() => wizardState.setIsCtaOpen(!wizardState.isCtaOpen)}
                      isGenerating={wizardState.isGenerating}
                      onBack={handleBackStep}
                      onNext={handleNextStep}
                    />
                  );

                case 6:
                  return (
                    <AudienceReachStep
                      selectedReachType={wizardState.selectedReachType}
                      onReachTypeChange={wizardState.setSelectedReachType}
                      selectedView={wizardState.selectedView}
                      selectedStatuses={wizardState.selectedStatuses}
                      selectedTags={wizardState.selectedTags}
                      logicOperator={wizardState.logicOperator}
                      onViewChange={wizardState.setSelectedView}
                      onStatusesChange={wizardState.setSelectedStatuses}
                      onTagsChange={wizardState.setSelectedTags}
                      onLogicOperatorChange={wizardState.setLogicOperator}
                      estimatedReach={estimatedReach}
                      audienceData={{
                        tags: availableTags,
                        statuses,
                        savedViews,
                        totalClientsCount,
                      }}
                      editState={editState || undefined}
                      onBack={handleBackStep}
                      onPublish={wizardState.handleConfirmPublish}
                    />
                  );

                default:
                  return null;
              }
            }}
            validations={wizardValidations}
            navigationConfig={{
              allowBack: true,
              allowSkipToCompleted: true,
              showNavigationButtons: false, // Each step handles its own buttons
            }}
            showSidebar={true}
            sidebarPosition="left"
            minHeight="600px"
          />
        </CardBody>
      </Card>

      {/* Image Regeneration Loading Modal */}
      <ImageRegenerateModal
        isOpen={wizardState.isImageRegenerateModalOpen}
        onClose={() => {
          wizardState.setIsImageRegenerateModalOpen(false);
        }}
        regenerateType={wizardState.regenerateType}
        loadingMessageIndex={wizardState.loadingMessageIndex}
      />

      {/* Email Template Builder Modal */}
      <EmailTemplateBuilder
        isOpen={wizardState.isTemplateBuilderOpen}
        onClose={() => wizardState.setIsTemplateBuilderOpen(false)}
        onSave={wizardState.handleSaveEmailTemplate}
        onUploadImage={wizardState.handleUploadEmailImage}
        initialTemplate={wizardState.savedEmailTemplate || undefined}
        variables={campaignVariables}
        locale="es"
      />
    </div>
  );
}
