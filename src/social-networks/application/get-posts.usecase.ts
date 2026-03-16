import { configuredPostsAdapter } from "../config/adapter.config";
import type {
	IGetPostsParams,
	IGetPostsResponse,
} from "../domain/interfaces/post.interface";
import type { IPostsPort } from "../domain/ports/posts.port";

/**
 * Caso de uso para obtener la lista de posts
 *
 * El adaptador usado (mock o API real) se controla desde:
 * @see ../config/adapter.config.ts
 *
 * @param params - Parámetros de filtrado y paginación
 * @param postsPort - Puerto de posts (inyección de dependencia, usa el configurado por defecto)
 * @returns Promise con la respuesta de posts paginada
 */
export const getPostsUseCase = async (
	params?: IGetPostsParams,
	postsPort: IPostsPort = configuredPostsAdapter
): Promise<IGetPostsResponse> => {
	return await postsPort.getPosts(params);
};
