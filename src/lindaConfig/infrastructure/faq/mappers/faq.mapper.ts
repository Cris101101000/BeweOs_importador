import type { IFAQ, IFAQFromKnowledgeGap } from "../../../domain/faq/interface";
import type { IKnowledgeGap } from "../../../domain/knowledge-gaps";
import type { FAQItemDTO } from "../dtos/faq.dto";

export class FAQMapper {
	static toDomain(item: FAQItemDTO): IFAQ {
		return {
			id: item.id,
			agencyId: item.agencyId,
			companyId: item.companyId,
			question: item.question,
			answer: item.answer,
			isActive: item.isActive,
			createdAt: new Date(item.createdAt),
			updatedAt: new Date(item.updatedAt),
		};
	}

	static toDomainList(items: FAQItemDTO[]): IFAQ[] {
		return items.map((item) => this.toDomain(item));
	}

	/**
	 * Maps a knowledge gap to FAQ-specific data for pre-filling the create FAQ modal
	 */
	static fromKnowledgeGap(gap: IKnowledgeGap): IFAQFromKnowledgeGap {
		return {
			question: gap.question,
			answer: gap.suggestedAnswer || "",
			gapId: gap.id,
		};
	}
}
