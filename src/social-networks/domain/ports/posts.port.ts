import type { EnumPostState } from "../enums/enum-post-state.enum";
import type {
	IGetPostsParams,
	IGetPostsResponse,
	IPost,
} from "../interfaces/post.interface";

/**
 * Request para crear un nuevo post
 */
export interface ICreatePostRequest {
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
 * Puerto para el servicio de posts
 * Define el contrato para las operaciones con posts de redes sociales
 */
export interface IPostsPort {
	/**
	 * Obtiene una lista paginada de posts
	 * @param params - Parámetros de filtrado y paginación
	 * @returns Promise con la respuesta que contiene items y total
	 */
	getPosts(params?: IGetPostsParams): Promise<IGetPostsResponse>;

	/**
	 * Obtiene un post por su ID
	 * @param id - ID del post
	 * @returns Promise con el post encontrado
	 */
	getPostById(id: string): Promise<IPost>;

	/**
	 * Crea un nuevo post
	 * @param request - Datos del post a crear
	 * @returns Promise con el post creado
	 */
	createPost(request: ICreatePostRequest): Promise<IPost>;

	/**
	 * Actualiza el estado de un post
	 * @param id - ID del post
	 * @param state - Nuevo estado del post
	 * @returns Promise con el post actualizado
	 */
	updatePostStatus(id: string, state: EnumPostState): Promise<IPost>;

	/**
	 * Elimina un post
	 * @param id - ID del post a eliminar
	 * @returns Promise que se resuelve cuando el post es eliminado
	 */
	deletePost(id: string): Promise<void>;
}
