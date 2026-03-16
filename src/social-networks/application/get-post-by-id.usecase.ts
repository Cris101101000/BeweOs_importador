import { configuredPostsAdapter } from "../config/adapter.config";
import type { IPost } from "../domain/interfaces/post.interface";
import type { IPostsPort } from "../domain/ports/posts.port";

/**
 * Caso de uso para obtener un post por su ID
 *
 * El adaptador usado (mock o API real) se controla desde:
 * @see ../config/adapter.config.ts
 *
 * @param id - ID del post
 * @param postsPort - Puerto de posts (inyección de dependencia, usa el configurado por defecto)
 * @returns Promise con el post encontrado
 */
export const getPostByIdUseCase = async (
	id: string,
	postsPort: IPostsPort = configuredPostsAdapter
): Promise<IPost> => {
	return await postsPort.getPostById(id);
};
