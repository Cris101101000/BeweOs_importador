import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import type { IdeaStatus } from "../../domain/enums/idea-status.enum";
import type { IIdeaBankResponse } from "../../domain/interfaces/idea-bank.interface";
import type {
	IIdeaBankRepository,
	IIdeaByIdPollingResponse,
	IdeaBankFilters,
} from "../../domain/ports/idea-bank.port";
import type {
	GetIdeaBankResponseDto,
	GetIdeaByIdResponseDto,
	UpdateIdeaStatusRequestDto,
} from "../dtos/idea-bank.dto";
import { toIdeaBankResponseFromDto } from "../mappers/idea-bank.mapper";

/**
 * Error personalizado para operaciones del banco de ideas
 */
export class IdeaBankError extends Error {
	constructor(
		message: string,
		public readonly code?: string
	) {
		super(message);
		this.name = "IdeaBankError";
	}
}

/**
 * Mapea errores de la API a mensajes amigables
 */
function mapIdeaBankError(error: any): string {
	// Si es un error de respuesta HTTP
	if (error?.error?.message) {
		return error.error.message;
	}

	// Si es un error de red
	if (error?.message?.includes("Network")) {
		return "Error de conexión. Por favor, verifica tu conexión a internet.";
	}

	// Si es un timeout
	if (error?.message?.includes("timeout")) {
		return "La solicitud tardó demasiado tiempo. Por favor, intenta nuevamente.";
	}

	// Error genérico
	return "Ocurrió un error al cargar las ideas. Por favor, intenta nuevamente.";
}

/**
 * Adaptador para el banco de ideas de Linda
 * Implementa la comunicación con el endpoint /linda/idea-bank
 */
export class IdeaBankAdapter implements IIdeaBankRepository {
	private readonly httpClient: IHttpClient = httpService;

	async getIdeas(filters?: IdeaBankFilters): Promise<IIdeaBankResponse> {
		try {
			// Construir parámetros de consulta
			const queryParams = new URLSearchParams();

			if (filters?.status) {
				queryParams.append("status", filters.status);
			}
			if (filters?.limit !== undefined) {
				queryParams.append("limit", String(filters.limit));
			}
			if (filters?.offset !== undefined) {
				queryParams.append("offset", String(filters.offset));
			}

			// Add cache-busting parameter to force fresh data
			queryParams.append("_t", Date.now().toString());

			// Construir URL
			const queryString = queryParams.toString();
			const url = `/linda/idea-bank?${queryString}`;

			// Realizar llamada a la API con timeout extendido
			const response = await this.httpClient.get<GetIdeaBankResponseDto>(url, {
				timeout: 600000, // 10 minutos = 600,000 ms
			});
			console.log("idea bank response", {response, url});
			// Verificar que response existe antes de acceder a sus propiedades
			if (!response) {
				throw new IdeaBankError(
					"Error en la conexión. No se pudo conectar con el servidor."
				);
			}

			// Verificar si la respuesta es exitosa
			if (response.success && response.data) {
				return toIdeaBankResponseFromDto(response.data);
			}

			// Manejar respuesta de error con mensaje amigable
			const errorMessage = mapIdeaBankError(response);
			throw new IdeaBankError(errorMessage, response.error?.code);
		} catch (error) {
			// Log del error para debugging
			console.error("Error fetching idea bank:", error);

			// Si ya es un IdeaBankError, re-lanzarlo
			if (error instanceof IdeaBankError) {
				throw error;
			}

			// Mapear errores desconocidos a mensajes amigables
			const errorMessage = mapIdeaBankError(error);
			throw new IdeaBankError(errorMessage);
		}
	}

	async getIdeaById(id: string): Promise<IIdeaByIdPollingResponse> {
		try {
			const url = `/linda/idea-bank/${id}`;
			const response =
				await this.httpClient.get<GetIdeaByIdResponseDto>(url);

			if (!response) {
				throw new IdeaBankError(
					"Error en la conexión. No se pudo conectar con el servidor."
				);
			}

			if (response.success && response.data) {
				const data = response.data as GetIdeaByIdResponseDto;
				return {
					contentGenerationStatus:
						data.content_generation_status ?? "generating",
					contentGenerationId: data.content_generation_id,
				};
			}

			const errorMessage = mapIdeaBankError(response);
			throw new IdeaBankError(errorMessage, response.error?.code);
		} catch (error) {
			console.error("Error fetching idea by id:", error);
			if (error instanceof IdeaBankError) {
				throw error;
			}
			const errorMessage = mapIdeaBankError(error);
			throw new IdeaBankError(errorMessage);
		}
	}

	async updateIdeaStatus(id: string, status: IdeaStatus): Promise<void> {
		try {
			const requestDto: UpdateIdeaStatusRequestDto = {
				status: status,
			};

			const url = `/linda/idea-bank/${id}`;
			const response = await this.httpClient.put(url, requestDto, {
				timeout: 600000, // 10 minutos = 600,000 ms
			});

			// Verificar que response existe antes de acceder a sus propiedades
			if (!response) {
				throw new IdeaBankError(
					"Error en la conexión. No se pudo conectar con el servidor."
				);
			}

			if (!response.success) {
				const errorMessage = mapIdeaBankError(response);
				throw new IdeaBankError(errorMessage, response.error?.code);
			}
		} catch (error) {
			console.error("Error updating idea status:", error);

			if (error instanceof IdeaBankError) {
				throw error;
			}

			// Si el error no tiene estructura de respuesta, es un error de conexión
			if (!error || typeof error !== "object" || !("error" in error)) {
				throw new IdeaBankError(
					"Error en la conexión. Verifica tu conexión a internet."
				);
			}

			const errorMessage = mapIdeaBankError(error);
			throw new IdeaBankError(errorMessage);
		}
	}
}
