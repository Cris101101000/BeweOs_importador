import type { IKnowledgeGap } from "../../../domain/knowledge-gaps";
import { KnowledgeGapType } from "../../../domain/knowledge-gaps";
import type { KnowledgeGapItemDTO } from "../dtos/knowledge-gap.dto";

export class KnowledgeGapMapper {
	static toDomain(item: KnowledgeGapItemDTO): IKnowledgeGap {
		return {
			id: item.id,
			type:
				KnowledgeGapType[item.type as keyof typeof KnowledgeGapType] ||
				KnowledgeGapType.FAQ,
			question: item.data?.question || item.data?.context || "",
			suggestedAnswer: item.data?.suggested_answer || "",
			frequency: item.data?.frequency || "medium",
			status: item.status,
			createdAt: new Date(item.createdAt),
			updatedAt: new Date(item.updatedAt),
			...(item.data?.service_name || item.data?.product_name
				? { suggestedName: item.data.service_name || item.data.product_name }
				: {}),
			...(item.data?.category ? { suggestedCategory: item.data.category } : {}),
			...(item.data?.estimated_price
				? { suggestedPrice: item.data.estimated_price }
				: {}),
		};
	}
	static toDomainList(items: KnowledgeGapItemDTO[]): IKnowledgeGap[] {
		return items.map((item) => this.toDomain(item));
	}
}
