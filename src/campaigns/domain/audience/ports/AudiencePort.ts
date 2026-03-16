import type { Result } from "@shared/domain/errors/Result";
import type {
	IAudienceFilter,
	IAudienceSegment,
	IClientStatus,
	ISavedView,
	ITag,
} from "../interfaces/Audience";
import type {
	CalculateAudienceError,
	GetAudienceDataError,
} from "../errors/AudienceError";

/**
 * Puerto para operaciones de segmentación de audiencia
 */
export interface IAudiencePort {
	/**
	 * Obtiene todos los tags disponibles
	 */
	getTags(): Promise<Result<ITag[], GetAudienceDataError>>;

	/**
	 * Obtiene todos los estados de clientes disponibles
	 */
	getClientStatuses(): Promise<Result<IClientStatus[], GetAudienceDataError>>;

	/**
	 * Obtiene segmentos inteligentes pre-configurados
	 */
	getIntelligentSegments(): Promise<
		Result<IAudienceSegment[], GetAudienceDataError>
	>;

	/**
	 * Calcula el tamaño de audiencia según filtros
	 */
	calculateAudienceSize(
		filter: IAudienceFilter
	): Promise<Result<number, CalculateAudienceError>>;

	/**
	 * Obtiene los canales de creación disponibles
	 */
	getCreationChannels(): Promise<Result<string[], GetAudienceDataError>>;

	/**
	 * Obtiene categorías de clientes
	 */
	getClientCategories(): Promise<Result<string[], GetAudienceDataError>>;

	/**
	 * Obtiene vistas guardadas del CRM
	 */
	getSavedViews(): Promise<Result<ISavedView[], GetAudienceDataError>>;

	/**
	 * Obtiene el total de clientes en el CRM
	 */
	getTotalClientsCount(): Promise<Result<number, GetAudienceDataError>>;
}
