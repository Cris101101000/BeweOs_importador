import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import type { QuickStart } from "../../../domain/quick-starts/interfaces";
import type { IQuickStartsPort } from "../../../domain/quick-starts/ports";
import type {
	QuickStartListResponseDTO,
	QuickStartSingleResponseDTO,
} from "../dtos/quick-start.dto";
import { QuickStartMapper } from "../mappers/quick-start.mapper";

export class QuickStartsAdapter implements IQuickStartsPort {
	private readonly httpClient: IHttpClient = httpService;

	async getQuickStarts(): Promise<QuickStart[]> {
		const response = await this.httpClient.get<QuickStartListResponseDTO>(
			"/linda/config/preset-prompts"
		);

		if (response.success && response.data) {
			return QuickStartMapper.toDomainList(response.data.items);
		}

		throw new Error(response.error?.code || "Failed to get quick starts");
	}

	async createQuickStart(quickStart: QuickStart): Promise<QuickStart> {
		const response = await this.httpClient.post<QuickStartSingleResponseDTO>(
			"/linda/config/preset-prompts",
			QuickStartMapper.toCreateDTO(quickStart)
		);

		if (response.success && response.data) {
			return QuickStartMapper.toDomain(response.data);
		}

		throw new Error(response.error?.code || "Failed to create quick start");
	}

	async updateQuickStart(
		id: string,
		quickStart: Partial<QuickStart>
	): Promise<QuickStart> {
		const response = await this.httpClient.put<QuickStartSingleResponseDTO>(
			`/linda/config/preset-prompts/${id}`,
			QuickStartMapper.toUpdateDTO(quickStart)
		);

		if (response.success && response.data) {
			return QuickStartMapper.toDomain(response.data);
		}

		throw new Error(response.error?.code || "Failed to update quick start");
	}

	async deleteQuickStart(id: string): Promise<void> {
		const response = await this.httpClient.delete<void>(
			`/linda/config/preset-prompts/${id}`
		);

		if (response.success) {
			return;
		}

		throw new Error(response.error?.code || "Failed to delete quick start");
	}
}
