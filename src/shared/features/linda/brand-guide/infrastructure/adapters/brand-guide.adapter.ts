import type { IBrandGuideRepository } from '../../domain/ports/brand-guide.port';
import type { IBrandGuide } from '../../domain/interfaces/brand-guide.interface';
import type { ISimpleBrandGuide } from '../../domain/interfaces/brand-guide.interface';
import type {
	GetBrandGuideResponseDto,
	UpdateBrandGuideRequestDto,
	GenerateBrandGuideRequestDto,
	ExtractBrandGuideRequestDto,
	ExtractSimpleBrandGuideRequestDto,
	ExtractSimpleBrandGuideResponseDto,
} from '../dtos/brand-guide.dto';
import { toBrandGuideFromDto, toBrandGuideDtoFromDomain } from '../mappers/brand-guide.mapper';
import { BrandGuideError, mapBrandGuideError } from '../utils/brand-guide-error.util';
import { httpService, type IHttpClient } from '@shared/infrastructure/services';
import { Result } from '@shared/domain/errors/Result';

/**
 * Adaptador para la guía de marca de Linda
 * Implementa la comunicación con el endpoint /linda/brand-guide
 */
export class BrandGuideAdapter implements IBrandGuideRepository {
	private readonly httpClient: IHttpClient = httpService;

	async getBrandGuide(): Promise<IBrandGuide> {
		try {
			// Construir parámetros de consulta con cache-busting
			const queryParams = new URLSearchParams();
			queryParams.append("_t", Date.now().toString());

			// Construir URL
			const url = `/linda/brand-guide?${queryParams.toString()}`;

			// Realizar llamada a la API con timeout extendido
			const response = await this.httpClient.get<GetBrandGuideResponseDto>(
				url,
				{
					timeout: 600000, // 10 minutos = 600,000 ms
				}
			);

			// Verificar que response existe antes de acceder a sus propiedades
			if (!response) {
				throw new BrandGuideError(
					'Error en la conexión. No se pudo conectar con el servidor.'
				);
			}

			// Verificar si la respuesta es exitosa
			if (response.success && response.data) {
				return toBrandGuideFromDto(response.data);
			}

			// Manejar respuesta de error con mensaje amigable
			const errorMessage = mapBrandGuideError(response);
			throw new BrandGuideError(errorMessage, response.error?.code);
		} catch (error) {
			// Log del error para debugging
			console.error("Error fetching brand guide:", error);

			// Si ya es un BrandGuideError, re-lanzarlo
			if (error instanceof BrandGuideError) {
				throw error;
			}

			// Mapear errores desconocidos a mensajes amigables
			const errorMessage = mapBrandGuideError(error);
			throw new BrandGuideError(errorMessage);
		}
	}

	async updateBrandGuide(data: Partial<IBrandGuide>): Promise<void> {
		try {
			// Convertir datos del dominio a DTO
			const requestDto: UpdateBrandGuideRequestDto =
				toBrandGuideDtoFromDomain(data);

			const url = "/linda/brand-guide";
			const response = await this.httpClient.put(url, requestDto, {
				timeout: 600000, // 10 minutos = 600,000 ms
			});

			// Verificar que response existe antes de acceder a sus propiedades
			if (!response) {
				throw new BrandGuideError(
					'Error en la conexión. No se pudo conectar con el servidor.'
				);
			}

			if (!response.success) {
				const errorMessage = mapBrandGuideError(response);
				throw new BrandGuideError(errorMessage, response.error?.code);
			}
		} catch (error) {
			console.error("Error updating brand guide:", error);

			if (error instanceof BrandGuideError) {
				throw error;
			}

			// Si el error no tiene estructura de respuesta, es un error de conexión
			if (!error || typeof error !== "object" || !("error" in error)) {
				throw new BrandGuideError(
					"Error en la conexión. Verifica tu conexión a internet."
				);
			}

			const errorMessage = mapBrandGuideError(error);
			throw new BrandGuideError(errorMessage);
		}
	}

	async patchBrandGuide(data: Partial<IBrandGuide>): Promise<void> {
		try {
			// Convertir datos del dominio a DTO
			const requestDto: UpdateBrandGuideRequestDto =
				toBrandGuideDtoFromDomain(data);

			const url = "/linda/brand-guide";
			const response = await this.httpClient.patch(url, requestDto, {
				timeout: 600000, // 10 minutos = 600,000 ms
			});

			// Verificar que response existe antes de acceder a sus propiedades
			if (!response) {
				throw new BrandGuideError(
					'Error en la conexión. No se pudo conectar con el servidor.'
				);
			}

			if (!response.success) {
				const errorMessage = mapBrandGuideError(response);
				throw new BrandGuideError(errorMessage, response.error?.code);
			}
		} catch (error) {
			console.error("Error patching brand guide:", error);

			if (error instanceof BrandGuideError) {
				throw error;
			}

			// Si el error no tiene estructura de respuesta, es un error de conexión
			if (!error || typeof error !== "object" || !("error" in error)) {
				throw new BrandGuideError(
					"Error en la conexión. Verifica tu conexión a internet."
				);
			}

			const errorMessage = mapBrandGuideError(error);
			throw new BrandGuideError(errorMessage);
		}
	}

	async generateBrandGuide(data: {
		smbAddedDescription: string;
		primaryColor: string;
		secondaryColor: string;
		logoUrl?: string;
	}): Promise<void> {
		try {
			const requestDto: GenerateBrandGuideRequestDto = {
				smbAddedDescription: data.smbAddedDescription,
				primaryColor: data.primaryColor,
				secondaryColor: data.secondaryColor,
				logoUrl: data.logoUrl,
			};

			const url = '/linda/brand-guide/generate';
			const response = await this.httpClient.post(url, requestDto, {
				timeout: 600000, // 10 minutos = 600,000 ms
			});

			// Verificar que response existe antes de acceder a sus propiedades
			if (!response) {
				throw new BrandGuideError(
					'Error en la conexión. No se pudo conectar con el servidor.'
				);
			}

			if (!response.success) {
				const errorMessage = mapBrandGuideError(response);
				throw new BrandGuideError(errorMessage, response.error?.code);
			}
		} catch (error) {
			console.error('Error generating brand guide:', error);

			if (error instanceof BrandGuideError) {
				throw error;
			}

			// Si el error no tiene estructura de respuesta, es un error de conexión
			if (!error || typeof error !== 'object' || !('error' in error)) {
				throw new BrandGuideError('Error en la conexión. Verifica tu conexión a internet.');
			}

			const errorMessage = mapBrandGuideError(error);
			throw new BrandGuideError(errorMessage);
		}
	}

	async extract(data: { url?: string; generateContentFromBrandExtraction?: boolean }): Promise<Result<void, BrandGuideError>> {
		try {
			const requestDto: ExtractBrandGuideRequestDto = {
				url: data.url,
				generateContentFromBrandExtraction: data.generateContentFromBrandExtraction,
			};

			const url = '/linda/brand-guide/extract';
			const response = await this.httpClient.post(url, requestDto, {
				timeout: 600000,
			});

			if (!response) {
				return Result.Err(new BrandGuideError('Error en la conexión. No se pudo conectar con el servidor.'));
			}

			if (!response.success) {
				const errorMessage = mapBrandGuideError(response);
				return Result.Err(new BrandGuideError(errorMessage, response.error?.code));
			}

			return Result.Ok();
		} catch (error) {
			console.error('Error extracting brand guide:', error);

			if (error instanceof BrandGuideError) {
				return Result.Err(error);
			}

			if (!error || typeof error !== 'object' || !('error' in error)) {
				return Result.Err(new BrandGuideError('Error en la conexión. Verifica tu conexión a internet.'));
			}

			const errorMessage = mapBrandGuideError(error);
			return Result.Err(new BrandGuideError(errorMessage));
		}
	}

	async extractSimple(data: { url: string }): Promise<Result<ISimpleBrandGuide, BrandGuideError>> {
		try {
			const requestDto: ExtractSimpleBrandGuideRequestDto = {
				url: data.url,
			};

			const url = '/linda/brand-guide/extract-simple';
			const response = await this.httpClient.post<ExtractSimpleBrandGuideResponseDto>(url, requestDto, {
				timeout: 600000,
			});

			if (!response) {
				return Result.Err(new BrandGuideError('Error en la conexión. No se pudo conectar con el servidor.'));
			}

			if (!response.success || !response.data) {
				const errorMessage = mapBrandGuideError(response);
				return Result.Err(new BrandGuideError(errorMessage, response.error?.code));
			}

			return Result.Ok(response.data);
		} catch (error) {
			console.error('Error extracting simple brand guide:', error);

			if (error instanceof BrandGuideError) {
				return Result.Err(error);
			}

			if (!error || typeof error !== 'object' || !('error' in error)) {
				return Result.Err(new BrandGuideError('Error en la conexión. Verifica tu conexión a internet.'));
			}

			const errorMessage = mapBrandGuideError(error);
			return Result.Err(new BrandGuideError(errorMessage));
		}
	}

	async patchLogoFile(file: File): Promise<void> {
		try {
			const formData = new FormData();
			formData.append('logo', file);

			const url = '/linda/brand-guide';
			const response = await this.httpClient.patch(url, formData, {
				timeout: 600000,
			});

			if (!response) {
				throw new BrandGuideError('Error en la conexión. No se pudo conectar con el servidor.');
			}

			if (!response.success) {
				const errorMessage = mapBrandGuideError(response);
				throw new BrandGuideError(errorMessage, response.error?.code);
			}
		} catch (error) {
			console.error('Error patching logo file:', error);

			if (error instanceof BrandGuideError) {
				throw error;
			}

			if (!error || typeof error !== 'object' || !('error' in error)) {
				throw new BrandGuideError('Error en la conexión. Verifica tu conexión a internet.');
			}

			const errorMessage = mapBrandGuideError(error);
			throw new BrandGuideError(errorMessage);
		}
	}
}
