import type {
	IKnowledgeGap,
	IKnowledgeGapRepository,
} from "../../domain/knowledge-gaps";

export class ManageKnowledgeGapsUseCase {
	constructor(
		private readonly knowledgeGapRepository: IKnowledgeGapRepository
	) {}

	async getAll(chatbotId: string): Promise<IKnowledgeGap[]> {
		return await this.knowledgeGapRepository.getAllKnowledgeGaps(chatbotId);
	}

	async deleteGap(gapId: string): Promise<void> {
		return await this.knowledgeGapRepository.deleteKnowledgeGap(gapId);
	}
}
