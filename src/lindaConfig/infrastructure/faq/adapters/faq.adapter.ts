import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import type {
	ICreateFAQInput,
	IFAQ,
	IFAQFilters,
	IFAQListResponse,
	IUpdateFAQInput,
} from "../../../domain/faq/interface";
import type { IFAQRepository } from "../../../domain/faq/port";
import type {
	CreateFAQRequestDTO,
	CreateFAQResponseDTO,
	FAQListDataDTO,
	UpdateFAQRequestDTO,
	UpdateFAQResponseDTO,
} from "../dtos/faq.dto";
import { FAQMapper } from "../mappers/faq.mapper";

export class FAQAdapter implements IFAQRepository {
	private readonly httpClient: IHttpClient = httpService;

	async getFAQs(filters?: IFAQFilters): Promise<IFAQListResponse> {
		const queryParams = new URLSearchParams();

		for (const [key, value] of Object.entries(filters || {})) {
			if (value !== undefined && value !== null && value !== "") {
				queryParams.append(key, String(value));
			}
		}

		const queryString = queryParams.toString();
		const url = `/linda/config/faqs${queryString ? `?${queryString}` : ""}`;

		const response = await this.httpClient.get<FAQListDataDTO>(url);

		if (response.success && response.data) {
			const items = FAQMapper.toDomainList(response.data.items);
			const total = response.data.total ?? 0;
			const limit = filters?.limit || 10;
			const currentPage = Math.floor((filters?.offset || 0) / limit) + 1;
			const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

			const pagination = {
				page: currentPage,
				limit: limit,
				total: total,
				totalPages: totalPages,
			};

			return {
				items,
				pagination,
				filters: filters || {},
			};
		}

		throw new Error(response.error?.code || "Failed to get all FAQs");
	}

	async createFAQ(faq: ICreateFAQInput): Promise<IFAQ> {
		const requestBody: CreateFAQRequestDTO = {
			question: faq.question,
			answer: faq.answer,
			// isActive: faq.isActive,
		};

		const response = await this.httpClient.post<CreateFAQResponseDTO>(
			"/linda/config/faqs",
			requestBody
		);

		if (response.success && response.data) {
			return FAQMapper.toDomain(response.data);
		}

		throw new Error(response.error?.code || "Failed to create FAQ");
	}

	async updateFAQ(id: string, faq: IUpdateFAQInput): Promise<IFAQ> {
		const requestBody: UpdateFAQRequestDTO = {};

		if (faq.question !== undefined) {
			requestBody.question = faq.question;
		}
		if (faq.answer !== undefined) {
			requestBody.answer = faq.answer;
		}
		if (faq.isActive !== undefined) {
			requestBody.isActive = faq.isActive;
		}

		const response = await this.httpClient.put<UpdateFAQResponseDTO>(
			`/linda/config/faqs/${id}`,
			requestBody
		);

		if (response.success && response.data) {
			return FAQMapper.toDomain(response.data);
		}

		throw new Error(response.error?.code || "Failed to update FAQ");
	}

	async deleteFAQ(id: string): Promise<void> {
		const response = await this.httpClient.delete<void>(
			`/linda/config/faqs/${id}`
		);

		if (!response.success) {
			throw new Error(response.error?.code || "Failed to delete FAQ");
		}
	}
}
