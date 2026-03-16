/**
 * Initial data interfaces for pre-filling catalog creation forms
 * Used when navigating from knowledge gaps to catalog creation
 */
import type { IKnowledgeGap } from "@lindaConfig/domain/knowledge-gaps";

// Initial data for product creation from knowledge gaps
export interface IProductInitialData {
	name?: string;
	description?: string;
	price?: number;
	categoryId?: string;
	gapId?: string;
}

// Initial data for service creation from knowledge gaps
export interface IServiceInitialData {
	name?: string;
	description?: string;
	price?: number;
	duration?: string;
	categoryId?: string;
	gapId?: string;
}

// Navigation state interface for knowledge gaps redirection
export interface IKnowledgeGapNavigationState {
	knowledgeGap?: IKnowledgeGap;
}
