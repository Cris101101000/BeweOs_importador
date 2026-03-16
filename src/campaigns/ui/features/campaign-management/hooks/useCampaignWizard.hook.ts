/**
 * useCampaignWizard Hook
 * Central state management for Campaign Wizard
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuraToast } from '@beweco/aurora-ui';
import { useTranslate } from '@tolgee/react';
import { configureSuccessToast } from '@shared/utils/toast-config.utils';
import type { ITemplate } from '@campaigns/domain';
import type { TEditorConfiguration } from '@shared/ui/components';
import type { 
  CampaignWizardState, 
  BrandConfig, 
  CTAConfig, 
  EditState,
  ReachType 
} from '../components/campaign-wizard/types';

const DEFAULT_BRAND_CONFIG: BrandConfig = {
  logo: "",
  useLogo: true,
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  generalPrompt: "",
};

const DEFAULT_CTA_CONFIG: CTAConfig = {
  type: "",
  value: "",
};

export function useCampaignWizard(editState: EditState | null) {
  const navigate = useNavigate();
  const { showToast } = useAuraToast();
  const { t } = useTranslate();

  // Initialize state from editState or defaults
  const initialReachType = editState?.isProposedCampaign && editState?.requiredTags && editState.requiredTags.length > 0 
    ? "custom-logic" as ReachType 
    : "all" as ReachType;
  const initialTags = editState?.isProposedCampaign && editState?.requiredTags ? editState.requiredTags : [];

  // Campaign State
  const [selectedContentType, setSelectedContentType] = useState<string>(editState?.selectedContentType || "");
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null);
  const [savedEmailTemplate, setSavedEmailTemplate] = useState<TEditorConfiguration | null>(null);
  const [useAI, setUseAI] = useState<boolean | null>(editState?.editMode ? true : null);
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string>(editState?.generatedImage || "");
  const [generatedCaption, setGeneratedCaption] = useState<string>(editState?.generatedCaption || "");
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(DEFAULT_BRAND_CONFIG);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [ctaConfig, setCtaConfig] = useState<CTAConfig>(DEFAULT_CTA_CONFIG);
  const [selectedReachType, setSelectedReachType] = useState<ReachType>(initialReachType);
  const [selectedView, setSelectedView] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [logicOperator, setLogicOperator] = useState<"and" | "or">("and");

  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBrandConfigOpen, setIsBrandConfigOpen] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [imageEditMode, setImageEditMode] = useState<'upload' | 'ai'>('upload');
  const [isImageEditOpen, setIsImageEditOpen] = useState(false);
  const [isTextEditOpen, setIsTextEditOpen] = useState(false);
  const [isCtaOpen, setIsCtaOpen] = useState(false);
  const [isTemplateBuilderOpen, setIsTemplateBuilderOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [editCaptionPrompt, setEditCaptionPrompt] = useState("");
  const [isImageRegenerateModalOpen, setIsImageRegenerateModalOpen] = useState(false);
  const [regenerateType, setRegenerateType] = useState<'create' | 'edit'>('create');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Computed values
  const isStory = selectedContentType === "instagram-story";
  const step4Title = useAI === true ? "Descripción" : useAI === false ? "Contenido" : "Contenido";

  // Handlers
  const handleSelectTemplate = useCallback((template: ITemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      if (template.content) {
        setGeneratedCaption(template.content);
      }
      if (template.thumbnailUrl) {
        setGeneratedImage(template.thumbnailUrl);
      }
    } else {
      setGeneratedCaption("");
      setGeneratedImage("");
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setRegenerateType('create');
    setLoadingMessageIndex(0);
    setIsImageRegenerateModalOpen(true);
    setIsGenerating(true);
    
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => {
        if (prev < 7) return prev + 1;
        return prev;
      });
    }, 1250);
    
    // Simulate AI generation delay (~5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    clearInterval(messageInterval);
    
    // Mock image generation
    const mockImageUrl = `https://picsum.photos/400/400?random=${Date.now()}`;
    const mockCaption = `🌟 ${prompt}\n\n✨ Creado con IA para conectar con tu audiencia\n\n#instagram #contenidoIA #marketing #creatividad`;
    
    setGeneratedImage(mockImageUrl);
    setGeneratedCaption(mockCaption);
    setIsGenerating(false);
    setIsImageRegenerateModalOpen(false);
  }, [prompt]);

  const handleGenerateImageWithAI = useCallback(async () => {
    if (!editPrompt.trim()) return;
    
    setRegenerateType('create');
    setLoadingMessageIndex(0);
    setIsImageRegenerateModalOpen(true);
    setIsGenerating(true);
    
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => {
        if (prev < 7) return prev + 1;
        return prev;
      });
    }, 1250);
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    clearInterval(messageInterval);
    
    const mockImageUrl = `https://picsum.photos/400/400?random=${Date.now()}`;
    
    setGeneratedImage(mockImageUrl);
    setIsGenerating(false);
    setIsImageRegenerateModalOpen(false);
    setEditPrompt("");
  }, [editPrompt]);

  const handleEditImage = useCallback(async () => {
    if (!editPrompt.trim() || !generatedImage) return;
    
    setRegenerateType('edit');
    setLoadingMessageIndex(0);
    setIsImageRegenerateModalOpen(true);
    setIsGenerating(true);
    
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => {
        if (prev < 7) return prev + 1;
        return prev;
      });
    }, 1250);
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    clearInterval(messageInterval);
    
    const mockEditedImageUrl = `https://picsum.photos/400/400?random=${Date.now()}&edit=true`;
    
    setGeneratedImage(mockEditedImageUrl);
    setIsGenerating(false);
    setIsImageRegenerateModalOpen(false);
    setEditPrompt("");
  }, [editPrompt, generatedImage]);

  const handleEditCaption = useCallback(async () => {
    if (!editCaptionPrompt.trim()) return;
    
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockEditedCaption = `✨ ${editCaptionPrompt}\n\n🚀 ${generatedCaption.split('\n\n')[1] || 'Contenido mejorado con IA'}\n\n#actualizado #contenidoIA #marketing`;
    
    setGeneratedCaption(mockEditedCaption);
    setIsGenerating(false);
    setEditCaptionPrompt("");
  }, [editCaptionPrompt, generatedCaption]);

  const handleConfirmPublish = useCallback(() => {
    const channelName = selectedContentType === 'whatsapp' ? 'WhatsApp' : 'Email';
    
    if (selectedContentType === 'whatsapp') {
      showToast(
        configureSuccessToast(
          'Campaña enviada a validación',
          'Tu campaña será enviada en breves después de la validación por parte de Whatsapp'
        )
      );
    } else {
      showToast(
        configureSuccessToast(
          `Campaña enviada por ${channelName} correctamente`,
          'Tu campaña ha sido publicada exitosamente'
        )
      );
    }
    
    navigate("/campaigns");
  }, [selectedContentType, showToast, navigate]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setGeneratedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleLogoUpload = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    
    if (file.size <= 2 * 1024 * 1024) {
      setIsUploadingLogo(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandConfig(prev => ({ ...prev, logo: e.target?.result as string }));
        setIsUploadingLogo(false);
      };
      reader.onerror = () => {
        setIsUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleLogoRemove = useCallback(() => {
    setBrandConfig(prev => ({ ...prev, logo: "" }));
  }, []);

  const handleSaveEmailTemplate = useCallback(async (document: TEditorConfiguration) => {
    setSavedEmailTemplate(document);
    showToast(
      configureSuccessToast(
        t("campaigns_save_success", "Plantilla guardada exitosamente"),
        t("campaigns_save_success_desc", "Tu plantilla de email ha sido guardada correctamente")
      )
    );
    setIsTemplateBuilderOpen(false);
  }, [showToast, t]);

  const handleUploadEmailImage = useCallback(async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  }, []);

  return {
    // State
    selectedContentType,
    selectedTemplate,
    savedEmailTemplate,
    useAI,
    prompt,
    selectedCategory,
    generatedImage,
    generatedCaption,
    brandConfig,
    campaignTitle,
    ctaConfig,
    selectedReachType,
    selectedView,
    selectedStatuses,
    selectedTags,
    logicOperator,
    isGenerating,
    isBrandConfigOpen,
    isUploadingLogo,
    imageEditMode,
    isImageEditOpen,
    isTextEditOpen,
    isCtaOpen,
    isTemplateBuilderOpen,
    editPrompt,
    editCaptionPrompt,
    isImageRegenerateModalOpen,
    regenerateType,
    loadingMessageIndex,
    isStory,
    step4Title,
    
    // Setters
    setSelectedContentType,
    setSelectedTemplate,
    setSavedEmailTemplate,
    setUseAI,
    setPrompt,
    setSelectedCategory,
    setGeneratedImage,
    setGeneratedCaption,
    setBrandConfig,
    setCampaignTitle,
    setCtaConfig,
    setSelectedReachType,
    setSelectedView,
    setSelectedStatuses,
    setSelectedTags,
    setLogicOperator,
    setIsBrandConfigOpen,
    setImageEditMode,
    setIsImageEditOpen,
    setIsTextEditOpen,
    setIsCtaOpen,
    setIsTemplateBuilderOpen,
    setEditPrompt,
    setEditCaptionPrompt,
    setIsImageRegenerateModalOpen,
    
    // Handlers
    handleSelectTemplate,
    handleGenerate,
    handleGenerateImageWithAI,
    handleEditImage,
    handleEditCaption,
    handleConfirmPublish,
    handleImageUpload,
    handleLogoUpload,
    handleLogoRemove,
    handleSaveEmailTemplate,
    handleUploadEmailImage,
  };
}
