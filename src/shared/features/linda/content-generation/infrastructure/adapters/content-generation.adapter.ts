import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type { ContentGenerationStatus } from "../../domain/enums/content-generation-status.enum";
import type {
	IContentGeneration,
	IContentGenerationResponse,
} from "../../domain/interfaces/content-generation.interface";
import type {
	ContentGenerationFilters,
	CreateContentGenerationRequest,
	EditImageResult,
	IContentGenerationRepository,
} from "../../domain/ports/content-generation.port";
import type {
	ContentGenerationDto,
	CreateContentGenerationRequestDto,
	CreateContentGenerationResponseDto,
	GetContentGenerationsResponseDto,
} from "../dtos/content-generation.dto";
import type {
	UpdateContentStatusRequestDto,
	UpdateContentStatusResponseDto,
} from "../dtos/update-content-status.dto";
import type {
	EditImageRequestDto,
	EditImageResponseDto,
} from "../dtos/content-generation.dto";
import {
	toContentGenerationFromDto,
	toContentGenerationResponseFromDto,
} from "../mappers/content-generation.mapper";
import {
	ContentGenerationError,
	mapContentGenerationError,
} from "../utils/content-generation-error.util";

export class ContentGenerationAdapter implements IContentGenerationRepository {
	private readonly httpClient: IHttpClient = httpService;

	async getContentGenerations(
		filters?: ContentGenerationFilters
	): Promise<IContentGenerationResponse> {
		/* ==================== MOCK IMPLEMENTATION ==================== */
		/* Uncomment this section to use mock data instead of real API */
		// Simulate API call delay
		// await new Promise(resolve => setTimeout(resolve, 500));

		// let filteredContent = [...mockContentGenerations];

		// // Apply filters
		// if (filters) {
		// 	if (filters.status) {
		// 		filteredContent = filteredContent.filter(content => content.status === filters.status);
		// 	}

		// 	if (filters.language) {
		// 		filteredContent = filteredContent.filter(content => content.language === filters.language);
		// 	}

		// 	if (filters.category) {
		// 		filteredContent = filteredContent.filter(content => content.category === filters.category);
		// 	}
		// }

		// // Apply pagination
		// const page = filters?.page || 1;
		// const limit = filters?.limit || 20;
		// const offset = (page - 1) * limit;
		// const paginatedContent = filteredContent.slice(offset, offset + limit);

		// return {
		// 	total: filteredContent.length,
		// 	page,
		// 	limit,
		// 	totalPages: Math.ceil(filteredContent.length / limit),
		// 	data: paginatedContent,
		// };

		/* ==================== END MOCK IMPLEMENTATION ==================== */

		/* ==================== REAL API IMPLEMENTATION ==================== */

		try {
			// Build query parameters
			const queryParams = new URLSearchParams();

			if (filters?.status) {
				queryParams.append("status", filters.status);
			}
			if (filters?.page) {
				queryParams.append("page", String(filters.page));
			}
			if (filters?.limit) {
				queryParams.append("limit", String(filters.limit));
			}
			if (filters?.language) {
				queryParams.append("language", filters.language);
			}
			if (filters?.category) {
				queryParams.append("category", filters.category);
			}
			if (filters?.origins) {
				if ( typeof filters.origins === "string") {
					const originsArray = filters.origins
						.split(",")
						.map((origin) => origin.trim())
						.filter((origin) => origin.length > 0);
					
					originsArray.forEach((origin) => {
						queryParams.append("origins", origin);
					});
			}}

			// Add cache-busting parameter to force fresh data
			queryParams.append("_t", Date.now().toString());

			// Build URL
			const queryString = queryParams.toString();
			const url = `/linda/content-generation?${queryString}`;

			// Make API call
			const response =
				await this.httpClient.get<GetContentGenerationsResponseDto>(url);
			console.log("content generations response", {response, url});

			// Check if successful
			if (response.success && response.data) {
				return toContentGenerationResponseFromDto(response.data);
			}

			// Handle error response with friendly message
			const errorMessage = mapContentGenerationError(response);
			throw new ContentGenerationError(errorMessage, response.error?.code);
		} catch (error) {
			// Log the error for debugging
			console.error("Error fetching content generations:", error);

			// If it's already a ContentGenerationError, rethrow it
			if (error instanceof ContentGenerationError) {
				throw error;
			}

			// Map unknown errors to friendly messages
			const errorMessage = mapContentGenerationError(error);
			throw new ContentGenerationError(errorMessage);
		}
		/* ==================== END REAL API IMPLEMENTATION ==================== */
	}

	async getContentGenerationById(
		id: string
	): Promise<IContentGeneration | null> {
		/* ==================== MOCK IMPLEMENTATION ==================== */
		/* Uncomment this section to use mock data instead of real API */
		/*
		// Simulate API call delay
		await new Promise(resolve => setTimeout(resolve, 300));

		const content = mockContentGenerations.find(c => c.id === id);
		return content || null;
		*/
		/* ==================== END MOCK IMPLEMENTATION ==================== */

		/* ==================== REAL API IMPLEMENTATION ==================== */
		try {
			const response = await this.httpClient.get<ContentGenerationDto>(
				`/linda/content-generation/${id}`
			);

			if (response.success && response.data) {
				return toContentGenerationFromDto(response.data);
			}

			// If not found, return null instead of throwing
			if (response.error?.code === "CONTENT_NOT_FOUND") {
				return null;
			}

			// Handle other errors with friendly message
			const errorMessage = mapContentGenerationError(response);
			throw new ContentGenerationError(errorMessage, response.error?.code);
		} catch (error) {
			// Log the error for debugging
			console.error(`Error fetching content generation ${id}:`, error);

			// If it's already a ContentGenerationError, rethrow it
			if (error instanceof ContentGenerationError) {
				throw error;
			}

			// Map unknown errors to friendly messages
			const errorMessage = mapContentGenerationError(error);
			throw new ContentGenerationError(errorMessage);
		}
		/* ==================== END REAL API IMPLEMENTATION ==================== */
	}

	async updateContentGenerationStatus(
		id: string,
		status: ContentGenerationStatus
	): Promise<IContentGeneration> {
		/* ==================== MOCK IMPLEMENTATION ==================== */
		/* Uncomment this section to use mock data instead of real API */
		/*
		// Simulate API call delay
		await new Promise(resolve => setTimeout(resolve, 400));

		const content = mockContentGenerations.find(c => c.id === id);
		
		if (!content) {
			throw new Error(`Content generation with id ${id} not found`);
		}

		// Update the mock data (in real implementation, this would be handled by the API)
		const updatedContent: IContentGeneration = {
			...content,
			status,
			updatedAt: new Date(),
			publishedAt: status === 'published' ? new Date() : content.publishedAt,
		};

		// Update the mock array
		const index = mockContentGenerations.findIndex(c => c.id === id);
		if (index !== -1) {
			mockContentGenerations[index] = updatedContent;
		}

		return updatedContent;
		*/
		/* ==================== END MOCK IMPLEMENTATION ==================== */

		/* ==================== REAL API IMPLEMENTATION ==================== */
		try {
			const requestDto: UpdateContentStatusRequestDto = {
				status,
			};

			const response =
				await this.httpClient.put<UpdateContentStatusResponseDto>(
					`/linda/content-generation/${id}/status`,
					requestDto
				);
			console.log("response", response);

			if (response.success && response.data) {
				return toContentGenerationFromDto(response.data);
			}

			// Handle error response with friendly message
			const errorMessage = mapContentGenerationError(response);
			throw new ContentGenerationError(errorMessage, response.error?.code);
		} catch (error) {
			// Log the error for debugging
			console.error(
				`Error updating content generation status for ${id}:`,
				error
			);

			// If it's already a ContentGenerationError, rethrow it
			if (error instanceof ContentGenerationError) {
				throw error;
			}

			// Map unknown errors to friendly messages
			const errorMessage = mapContentGenerationError(error);
			throw new ContentGenerationError(errorMessage);
		}
		/* ==================== END REAL API IMPLEMENTATION ==================== */
	}

	async createContentGeneration(
		request: CreateContentGenerationRequest
	): Promise<IContentGeneration> {
		try {
			const requestDto: CreateContentGenerationRequestDto = {
				user_input: request.userInput,
				thread_id: request.threadId,
			};

			// Solo agregar campos temporales si fueron proporcionados
			if (request.forceUseLogo !== undefined) {
				requestDto.force_use_logo = request.forceUseLogo;
			}
			if (request.temporalLogoUrl) {
				requestDto.temporal_logo_url = request.temporalLogoUrl;
			}
			if (request.temporalVisualStyle) {
				requestDto.temporal_visual_style = request.temporalVisualStyle;
			}
			if (request.temporalPrimaryColor) {
				requestDto.temporal_primary_color = request.temporalPrimaryColor;
			}
			if (request.temporalSecondaryColor) {
				requestDto.temporal_secondary_color = request.temporalSecondaryColor;
			}

			const response =
				await this.httpClient.post<CreateContentGenerationResponseDto>(
					"/linda/content-generation",
					requestDto,
					{
						timeout: 300000, // 5 minutes - Extended timeout for AI content generation
					}
				);

			if (response.success && response.data) {
				return toContentGenerationFromDto(response.data);
			}

			// Handle error response with friendly message
			const errorMessage = mapContentGenerationError(response);
			throw new ContentGenerationError(errorMessage, response.error?.code);
		} catch (error) {
			// Log the error for debugging
			console.error("Error creating content generation:", error);

			// If it's already a ContentGenerationError, rethrow it
			if (error instanceof ContentGenerationError) {
				throw error;
			}

			// Map unknown errors to friendly messages
			const errorMessage = mapContentGenerationError(error);
			throw new ContentGenerationError(errorMessage);
		}
	}

	async editImage(
		id: string,
		prompt: string,
		imageUrls?: string[]
	): Promise<EditImageResult> {
		try {
			const requestDto: EditImageRequestDto = {
				prompt,
			};

			// Solo agregar additional_reference_urls si se proporcionaron
			if (imageUrls && imageUrls.length > 0) {
				requestDto.additional_reference_urls = imageUrls;
			}
			console.log("requestDto => ", requestDto);

			const response = await this.httpClient.put<EditImageResponseDto>(
				`/linda/content-generation/${id}/edit-image`,
				requestDto,
				{
					timeout: 300000, // 5 minutes - Extended timeout for AI image editing
				}
			);
			console.log("response editImage con IA=> ", response);

			if (response.success && response.data) {
				const data = response.data;
				const content = toContentGenerationFromDto(data);
				const newImageUrl = data.new_url;
				return { content, newImageUrl };
			}

			// Handle error response with friendly message
			const errorMessage = mapContentGenerationError(response);
			throw new ContentGenerationError(errorMessage, response.error?.code);
		} catch (error) {
			console.error(`Error editing image for content generation ${id}:`, error);

			if (error instanceof ContentGenerationError) {
				throw error;
			}

			const errorMessage = mapContentGenerationError(error);
			throw new ContentGenerationError(errorMessage);
		}
	}
}
