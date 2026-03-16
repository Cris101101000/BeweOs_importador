import type { IKnowledgeGap } from "./interfaces";

export interface IKnowledgeGapRepository {
	getAllKnowledgeGaps(chatbotId: string): Promise<IKnowledgeGap[]>;
	deleteKnowledgeGap(gapId: string): Promise<void>;
}
