/**
 * DTO para un post recibido desde la API
 */
export interface PostDto {
	id: string;
	agencyId: string;
	companyId: string;
	name: string;
	description: string;
	channel: string;
	postType: string;
	imageUrl: string;
	date: string;
	aiGenerationType: string;
	logo?: string;
	primaryColor?: string;
	secondaryColor?: string;
	brandDescription?: string;
	state: string;
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	contentId?: string | null;
	numLikes?: number;
	numComments?: number;
	numShareds?: number;
}

/**
 * DTO para la respuesta paginada de posts desde la API
 */
export interface GetPostsResponseDto {
	items: PostDto[];
	total: number;
}

/**
 * DTO para los parámetros de consulta de posts
 * Los campos state, channel y postType pueden ser arrays para filtrado múltiple
 */
export interface GetPostsParamsDto {
	limit?: number;
	offset?: number;
	order?: string;
	search?: string;
	state?: string | string[]; // Puede ser uno o múltiples estados
	channel?: string | string[]; // Puede ser uno o múltiples canales
	postType?: string | string[]; // Puede ser uno o múltiples tipos
	aiGenerationType?: string;
	agencyId?: string;
	companyId?: string;
	dateFrom?: string;
	dateTo?: string;
}

/**
 * DTO para crear un nuevo post
 */
export interface CreatePostRequestDto {
  name: string;
  description: string;
  channel: string;
  postType: string;
  date: string;
  imageUrl: string;
  aiGenerationType: string;
  contentId?: string;
  /** Brand config: Logo URL */
  logo?: string | null;
  /** Brand config: Primary color in hex format */
  primaryColor?: string | null;
  /** Brand config: Secondary color in hex format */
  secondaryColor?: string | null;
  /** Brand config: General prompt/description */
  brandDescription?: string | null;
  agencyId: string;
  companyId: string;
}

/**
 * DTO para la respuesta de crear un post
 */
export interface CreatePostResponseDto {
	success: boolean;
	message: string;
	data: PostDto;
	timestamp: string;
}

/**
 * DTO para actualizar el estado de un post
 */
export interface UpdatePostStatusRequestDto {
	state: string;
}

/**
 * DTO para la respuesta de actualizar el estado de un post
 */
export interface UpdatePostStatusResponseDto {
	success: boolean;
	message: string;
	data: PostDto;
	timestamp: string;
}

/**
 * DTO para la respuesta de eliminar un post
 */
export interface DeletePostResponseDto {
	success: boolean;
	message: string;
	timestamp: string;
}
