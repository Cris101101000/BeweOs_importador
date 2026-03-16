import type { Result } from "@shared/domain/errors/Result";
import type { IAudiencePort } from "@campaigns/domain/audience/ports/AudiencePort";
import type { GetAudienceDataError } from "@campaigns/domain/audience/errors/AudienceError";
import type {
	IAudienceSegment,
	IClientStatus,
	ISavedView,
	ITag,
} from "@campaigns/domain/audience/interfaces/Audience";

/**
 * UseCase para obtener datos de audiencia (tags, estados, segmentos, etc.)
 */
export class GetAudienceDataUseCase {
	constructor(private readonly audiencePort: IAudiencePort) {}

	async getTags(): Promise<Result<ITag[], GetAudienceDataError>> {
		return await this.audiencePort.getTags();
	}

	async getClientStatuses(): Promise<Result<IClientStatus[], GetAudienceDataError>> {
		return await this.audiencePort.getClientStatuses();
	}

	async getIntelligentSegments(): Promise<Result<IAudienceSegment[], GetAudienceDataError>> {
		return await this.audiencePort.getIntelligentSegments();
	}

	async getCreationChannels(): Promise<Result<string[], GetAudienceDataError>> {
		return await this.audiencePort.getCreationChannels();
	}

	async getClientCategories(): Promise<Result<string[], GetAudienceDataError>> {
		return await this.audiencePort.getClientCategories();
	}

	async getSavedViews(): Promise<Result<ISavedView[], GetAudienceDataError>> {
		return await this.audiencePort.getSavedViews();
	}

	async getTotalClientsCount(): Promise<Result<number, GetAudienceDataError>> {
		return await this.audiencePort.getTotalClientsCount();
	}
}
