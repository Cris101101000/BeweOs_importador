import type { EnumAIGenerationType } from "../enums/enum-ai-generation-type.enum";
import type { EnumChannel } from "../enums/enum-channel.enum";
import type { EnumPostState } from "../enums/enum-post-state.enum";
import type { EnumPostType } from "../enums/enum-post-type.enum";

/**
 * Interface para representar un post de redes sociales
 */
export interface IPost {
	id: string;
	agencyId: string;
	companyId: string;
	name: string;
	description: string;
	channel: EnumChannel;
	postType: EnumPostType;
	imageUrl: string;
	date: Date;
	aiGenerationType: EnumAIGenerationType;
	logo?: string;
	primaryColor?: string;
	secondaryColor?: string;
	brandDescription?: string;
	state: EnumPostState;
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
	contentId?: string | null;
	numLikes?: number;
	numComments?: number;
	numShareds?: number;
}

/**
 * Interface para los parámetros de consulta de posts
 */
export interface IGetPostsParams {
	limit?: number;
	offset?: number;
	order?: string;
	search?: string;
	state?: EnumPostState | EnumPostState[]; // Puede ser uno o múltiples estados
	channel?: EnumChannel | EnumChannel[]; // Puede ser uno o múltiples canales
	postType?: EnumPostType | EnumPostType[]; // Puede ser uno o múltiples tipos
	aiGenerationType?: EnumAIGenerationType;
	agencyId?: string;
	companyId?: string;
	dateFrom?: string;
	dateTo?: string;
}

/**
 * Interface para la respuesta paginada de posts
 */
export interface IGetPostsResponse {
	items: IPost[];
	total: number;
}
