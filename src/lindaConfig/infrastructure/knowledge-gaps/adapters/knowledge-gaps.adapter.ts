import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import type {
	IKnowledgeGap,
	IKnowledgeGapRepository,
} from "../../../domain/knowledge-gaps";
import type { KnowledgeGapListDataDTO } from "../dtos/knowledge-gap.dto";
import { KnowledgeGapMapper } from "../mappers/knowledge-gap.mapper";

export class KnowledgeGapsAdapter implements IKnowledgeGapRepository {
	private readonly httpClient: IHttpClient = httpService;

	async getAllKnowledgeGaps(_chatbotId: string): Promise<IKnowledgeGap[]> {
		const response = await this.httpClient.get<KnowledgeGapListDataDTO>(
			"/linda/config/knowledge-gaps"
		);
		if (response.success && response.data) {
			const items = response.data.items;

			const mapped = KnowledgeGapMapper.toDomainList(items);
			return mapped;
		}

		throw new Error(response.error?.code || "Failed to get all knowledge gaps");
	}

	async deleteKnowledgeGap(gapId: string): Promise<void> {
		const response = await this.httpClient.delete<void>(
			`/linda/config/knowledge-gaps/${gapId}`
		);

		if (!response.success) {
			throw new Error(response.error?.code || "Failed to delete knowledge gap");
		}
	}
}

export { KnowledgeGapsAdapter as KnowledgeGapRepositoryAdapter };
