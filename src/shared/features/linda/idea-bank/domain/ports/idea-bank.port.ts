import type { IdeaStatus } from "../enums/idea-status.enum";
import type { IIdeaBankResponse } from "../interfaces/idea-bank.interface";

/**
 * Respuesta al obtener una idea por ID (para polling de generación)
 */
export interface IIdeaByIdPollingResponse {
	contentGenerationStatus: string;
	contentGenerationId?: string;
}

/**
 * Puerto para el repositorio del banco de ideas de Linda
 */
export interface IIdeaBankRepository {
	getIdeas(filters?: IdeaBankFilters): Promise<IIdeaBankResponse>;
	getIdeaById(id: string): Promise<IIdeaByIdPollingResponse>;
	updateIdeaStatus(id: string, status: IdeaStatus): Promise<void>;
}

/**
 * Filtros para consultar ideas del banco
 */
export interface IdeaBankFilters {
	status?: IdeaStatus;
	limit?: number;
	offset?: number;
}
