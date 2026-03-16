import type {
	ICreateFAQInput,
	IFAQ,
	IFAQFilters,
	IFAQListResponse,
	IUpdateFAQInput,
} from "../../domain/faq/interface";
import type { IFAQRepository } from "../../domain/faq/port";

export class ManageFAQsUseCase {
	constructor(private readonly faqRepository: IFAQRepository) {}

	async getFAQs(filters?: IFAQFilters): Promise<IFAQListResponse> {
		return await this.faqRepository.getFAQs(filters);
	}

	async createFAQ(faq: ICreateFAQInput): Promise<IFAQ> {
		return await this.faqRepository.createFAQ(faq);
	}

	async updateFAQ(id: string, faq: IUpdateFAQInput): Promise<IFAQ> {
		return await this.faqRepository.updateFAQ(id, faq);
	}

	async deleteFAQ(id: string): Promise<void> {
		return await this.faqRepository.deleteFAQ(id);
	}
}
