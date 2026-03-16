import type { EnumAIGenerationType } from "../../domain/enums/enum-ai-generation-type.enum";
import type { EnumChannel } from "../../domain/enums/enum-channel.enum";
import type { EnumPostState } from "../../domain/enums/enum-post-state.enum";
import type { EnumPostType } from "../../domain/enums/enum-post-type.enum";
import type {
	IGetPostsParams,
	IGetPostsResponse,
	IPost,
} from "../../domain/interfaces/post.interface";
import type {
	GetPostsParamsDto,
	GetPostsResponseDto,
	PostDto,
} from "../dtos/post.dto";

/**
 * Mapper para transformar datos entre DTOs y modelos de dominio de posts
 */
export class PostMapper {
	/**
	 * Convierte un DTO de post a la interface de dominio
	 */
	static toDomain(dto: PostDto): IPost {
		return {
			id: dto.id,
			agencyId: dto.agencyId,
			companyId: dto.companyId,
			name: dto.name,
			description: dto.description,
			channel: dto.channel as EnumChannel,
			postType: dto.postType as EnumPostType,
			imageUrl: dto.imageUrl,
			date: new Date(dto.date),
			aiGenerationType: dto.aiGenerationType as EnumAIGenerationType,
			logo: dto.logo,
			primaryColor: dto.primaryColor,
			secondaryColor: dto.secondaryColor,
			brandDescription: dto.brandDescription,
			state: dto.state as EnumPostState,
			createdAt: new Date(dto.createdAt),
			updatedAt: new Date(dto.updatedAt),
			createdBy: dto.createdBy,
			contentId: dto.contentId,
			numLikes: dto.numLikes || 0,
			numComments: dto.numComments || 0,
			numShareds: dto.numShareds || 0,
		};
	}

	/**
	 * Convierte una respuesta DTO de posts a la interface de dominio
	 */
	static toGetPostsResponse(dto: GetPostsResponseDto): IGetPostsResponse {
		return {
			items: dto.items.map((item) => PostMapper.toDomain(item)),
			total: dto.total,
		};
	}

	/**
	 * Convierte parámetros de dominio a DTO para la API
	 * Maneja conversión de arrays de enums a arrays de strings
	 */
	static toGetPostsParamsDto(params?: IGetPostsParams): GetPostsParamsDto {
		if (!params) {
			return {};
		}

		// Helper para convertir enum o array de enums a string o array de strings
		const convertToStringOrArray = <T extends string>(
			value: T | T[] | undefined
		): string | string[] | undefined => {
			if (!value) return undefined;
			if (Array.isArray(value)) {
				return value.map((v) => v as string);
			}
			return value as string;
		};

		return {
			limit: params.limit,
			offset: params.offset,
			order: params.order,
			search: params.search,
			state: convertToStringOrArray(params.state),
			channel: convertToStringOrArray(params.channel),
			postType: convertToStringOrArray(params.postType),
			aiGenerationType: params.aiGenerationType,
			agencyId: params.agencyId,
			companyId: params.companyId,
			dateFrom: params.dateFrom,
			dateTo: params.dateTo,
		};
	}
}
