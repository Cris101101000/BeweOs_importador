/**
 * Types for Campaign Wizard
 * Shared types and interfaces for all wizard steps
 */

import type { ITemplate, ISavedView } from '@campaigns/domain';
import type { TEditorConfiguration, CustomVariable, BrandConfig } from '@shared/ui/components';

export type ReachType = "all" | "saved-view" | "custom-logic";

// Re-export BrandConfig from shared for backwards compatibility
export type { BrandConfig } from '@shared/ui/components';

export interface CTAConfig {
  type: string;
  value: string;
}

export interface AudienceData {
  tags: Array<{ value: string; label: string; count: number; color: string }>;
  statuses: Array<{ value: string; label: string; count: number; color: string }>;
  savedViews: ISavedView[];
  totalClientsCount: number;
}

export interface ProposedCampaignState {
  targetAudienceCount?: number;
  audienceReason?: string;
  requiredTags?: string[];
  isProposedCampaign?: boolean;
}

export interface EditState extends ProposedCampaignState {
  editMode?: boolean;
  currentStep?: number;
  selectedContentType?: string;
  generatedImage?: string;
  generatedCaption?: string;
  itemId?: string;
}

export interface CampaignWizardState {
  // Step 1: Channel
  selectedContentType: string;
  
  // Step 2: Template
  selectedTemplate: ITemplate | null;
  savedEmailTemplate: TEditorConfiguration | null;
  
  // Step 3: Options
  useAI: boolean | null;
  
  // Step 4: Content Creation
  prompt: string;
  selectedCategory: string;
  generatedImage: string;
  generatedCaption: string;
  brandConfig: BrandConfig;
  
  // Step 5: Publication
  campaignTitle: string;
  ctaConfig: CTAConfig;
  
  // Step 6: Audience
  selectedReachType: ReachType;
  selectedView: string;
  selectedStatuses: string[];
  selectedTags: string[];
  logicOperator: "and" | "or";
  
  // UI States
  isGenerating: boolean;
  isBrandConfigOpen: boolean;
  imageEditMode: 'upload' | 'ai';
  isImageEditOpen: boolean;
  isTextEditOpen: boolean;
  isCtaOpen: boolean;
  isTemplateBuilderOpen: boolean;
  
  // Edit prompts
  editPrompt: string;
  editCaptionPrompt: string;
  
  // Modal states
  isImageRegenerateModalOpen: boolean;
  regenerateType: 'create' | 'edit';
  loadingMessageIndex: number;
}
