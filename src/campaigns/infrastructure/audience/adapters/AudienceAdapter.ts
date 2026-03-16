import { Result } from "@shared/domain/errors/Result";
import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import type {
	IAudienceFilter,
	IAudiencePort,
	IAudienceSegment,
	IClientStatus,
	ISavedView,
	ITag,
} from "@campaigns/domain/audience/interfaces/Audience";
import {
	CalculateAudienceError,
	GetAudienceDataError,
} from "@campaigns/domain/audience/errors/AudienceError";
import {
	MOCK_CLIENT_CATEGORIES,
	MOCK_CLIENT_STATUSES,
	MOCK_CREATION_CHANNELS,
	MOCK_INTELLIGENT_SEGMENTS,
	MOCK_TAGS,
} from "../../mocks";

/**
 * Adaptador para operaciones de segmentación de audiencia
 * Implementa el puerto IAudiencePort definido en el dominio
 */
export class AudienceAdapter implements IAudiencePort {
	private readonly httpClient: IHttpClient = httpService;

	async getTags(): Promise<Result<ITag[], GetAudienceDataError>> {
		try {
			await this.delay(300);
			return Result.Ok(MOCK_TAGS);
		} catch (error) {
			return Result.Err(new GetAudienceDataError(error instanceof Error ? error.message : undefined));
		}
	}

	async getClientStatuses(): Promise<Result<IClientStatus[], GetAudienceDataError>> {
		try {
			await this.delay(200);
			return Result.Ok(MOCK_CLIENT_STATUSES);
		} catch (error) {
			return Result.Err(new GetAudienceDataError(error instanceof Error ? error.message : undefined));
		}
	}

	async getIntelligentSegments(): Promise<Result<IAudienceSegment[], GetAudienceDataError>> {
		try {
			await this.delay(400);
			return Result.Ok(MOCK_INTELLIGENT_SEGMENTS);
		} catch (error) {
			return Result.Err(new GetAudienceDataError(error instanceof Error ? error.message : undefined));
		}
	}

	async calculateAudienceSize(
		filter: IAudienceFilter
	): Promise<Result<number, CalculateAudienceError>> {
		try {
			await this.delay(500);

			// Lógica simplificada de cálculo basada en filtros
			let baseSize = 1000;

			if (filter.selectedStatuses.length > 0) {
				baseSize = filter.selectedStatuses.reduce(
					(sum: number, status: string) => {
						const statusData = MOCK_CLIENT_STATUSES.find(
							(s) => s.value === status
						);
						return sum + (statusData?.count || 0);
					},
					0
				);
			}

			if (filter.selectedTags.length > 0) {
				const tagCount = filter.selectedTags.reduce(
					(sum: number, tag: string) => {
						const tagData = MOCK_TAGS.find((t) => t.value === tag);
						return sum + (tagData?.count || 0);
					},
					0
				);
				baseSize = Math.min(baseSize, tagCount);
			}

			return Result.Ok(Math.max(baseSize, 0));
		} catch (error) {
			return Result.Err(new CalculateAudienceError(error instanceof Error ? error.message : undefined));
		}
	}

	async getCreationChannels(): Promise<Result<string[], GetAudienceDataError>> {
		try {
			await this.delay(200);
			return Result.Ok(MOCK_CREATION_CHANNELS);
		} catch (error) {
			return Result.Err(new GetAudienceDataError(error instanceof Error ? error.message : undefined));
		}
	}

	async getClientCategories(): Promise<Result<string[], GetAudienceDataError>> {
		try {
			await this.delay(200);
			return Result.Ok(MOCK_CLIENT_CATEGORIES);
		} catch (error) {
			return Result.Err(new GetAudienceDataError(error instanceof Error ? error.message : undefined));
		}
	}

	async getSavedViews(): Promise<Result<ISavedView[], GetAudienceDataError>> {
		try {
			const response = await this.httpClient.get<ISavedView[]>("saved-views");

			if (response.success && response.data) {
				return Result.Ok(response.data);
			}

			return Result.Err(
				new GetAudienceDataError(
					response.error?.message || "Failed to get saved views"
				)
			);
		} catch (error) {
			return Result.Err(
				new GetAudienceDataError(
					error instanceof Error ? error.message : undefined
				)
			);
		}
	}

	async getTotalClientsCount(): Promise<Result<number, GetAudienceDataError>> {
		try {
			const response = await this.httpClient.get<{ total: number }>(
				"clients?limit=1&offset=1"
			);

			if (response.success && response.data) {
				return Result.Ok(response.data.total);
			}

			return Result.Err(
				new GetAudienceDataError(
					response.error?.message || "Failed to get total clients count"
				)
			);
		} catch (error) {
			return Result.Err(
				new GetAudienceDataError(
					error instanceof Error ? error.message : undefined
				)
			);
		}
	}

	/**
	 * Utilidad para simular delay de red
	 */
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
