/**
 * Mappers for converting knowledge gap data to catalog initial data
 * Used when navigating from knowledge gaps to product/service creation
 */
import type { IKnowledgeGap } from "@lindaConfig/domain/knowledge-gaps";
import type {
	IProductInitialData,
	IServiceInitialData,
} from "../../domain/interfaces/catalog-initial-data.interface";

/**
 * Maps a knowledge gap to product initial data for pre-filling the creation form
 */
export const mapKnowledgeGapToProduct = (
	gap: IKnowledgeGap
): IProductInitialData => ({
	name: gap.suggestedName || gap.question,
	description: gap.suggestedAnswer || "",
	price: gap.suggestedPrice,
	gapId: gap.id,
});

/**
 * Maps a knowledge gap to service initial data for pre-filling the creation form
 */
export const mapKnowledgeGapToService = (
	gap: IKnowledgeGap
): IServiceInitialData => ({
	name: gap.suggestedName || gap.question,
	description: gap.suggestedAnswer || "",
	price: gap.suggestedPrice,
	gapId: gap.id,
});
