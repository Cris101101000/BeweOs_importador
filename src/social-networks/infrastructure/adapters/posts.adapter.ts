import { httpService } from "@shared/infrastructure/services/api-http.service";
import type { EnumPostState } from "../../domain/enums/enum-post-state.enum";
import type {
	IGetPostsParams,
	IGetPostsResponse,
	IPost,
} from "../../domain/interfaces/post.interface";
import type {
	ICreatePostRequest,
	IPostsPort,
} from "../../domain/ports/posts.port";
import {
	type CreatePostRequestDto,
	type CreatePostResponseDto,
	type DeletePostResponseDto,
	type GetPostsResponseDto,
	PostDto,
	type UpdatePostStatusRequestDto,
	type UpdatePostStatusResponseDto,
} from "../dtos/post.dto";
import { PostMapper } from "../mappers/post.mapper";
import { MOCK_POSTS } from "../mocks/posts.mock";

/**
 * Adaptador para el servicio de posts
 * Implementa el puerto IPostsPort y se comunica con la API REST
 *
 * ⚠️ ACTUALMENTE USANDO MOCKS ⚠️
 * Para usar el backend real, descomentar las líneas marcadas con "// BACKEND:"
 * y comentar las líneas marcadas con "// MOCK:"
 */
export class PostsAdapter implements IPostsPort {
	//BACKEND:
	private readonly basePath = "/social-media/posts";

	/**
	 * Simula un delay de red para hacer el mock más realista
	 */
	private async simulateNetworkDelay(ms = 500): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Filtra y pagina los posts según los parámetros (MOCK)
	 */
	private filterAndPaginatePosts(
		posts: IPost[],
		params?: IGetPostsParams
	): { items: IPost[]; total: number } {
		let filteredPosts = [...posts];

		// Aplicar filtros
		if (params?.state) {
			filteredPosts = filteredPosts.filter(
				(post) => post.state === params.state
			);
		}

		if (params?.channel) {
			filteredPosts = filteredPosts.filter(
				(post) => post.channel === params.channel
			);
		}

		if (params?.postType) {
			filteredPosts = filteredPosts.filter(
				(post) => post.postType === params.postType
			);
		}

		if (params?.aiGenerationType) {
			filteredPosts = filteredPosts.filter(
				(post) => post.aiGenerationType === params.aiGenerationType
			);
		}

		if (params?.agencyId) {
			filteredPosts = filteredPosts.filter(
				(post) => post.agencyId === params.agencyId
			);
		}

		if (params?.companyId) {
			filteredPosts = filteredPosts.filter(
				(post) => post.companyId === params.companyId
			);
		}

		if (params?.search) {
			const searchLower = params.search.toLowerCase();
			filteredPosts = filteredPosts.filter(
				(post) =>
					post.name.toLowerCase().includes(searchLower) ||
					post.description.toLowerCase().includes(searchLower)
			);
		}

		if (params?.dateFrom) {
			const dateFrom = new Date(params.dateFrom);
			filteredPosts = filteredPosts.filter((post) => post.date >= dateFrom);
		}

		if (params?.dateTo) {
			const dateTo = new Date(params.dateTo);
			filteredPosts = filteredPosts.filter((post) => post.date <= dateTo);
		}

		// Ordenar (por defecto: más recientes primero)
		const order = params?.order || "desc";
		filteredPosts.sort((a, b) => {
			const dateA = a.createdAt.getTime();
			const dateB = b.createdAt.getTime();
			return order === "desc" ? dateB - dateA : dateA - dateB;
		});

		const total = filteredPosts.length;

		// Aplicar paginación
		const offset = params?.offset || 0;
		const limit = params?.limit || 10;
		const paginatedPosts = filteredPosts.slice(offset, offset + limit);

		return {
			items: paginatedPosts,
			total,
		};
	}

	/**
	 * Serializa los parámetros para enviar arrays como query params múltiples
	 * Ejemplo: { postType: ['story', 'post'] } => "postType=story&postType=post"
	 */
	private serializeParams(params: Record<string, any>): URLSearchParams {
		console.log("🔧 serializeParams recibió:", params);
		const searchParams = new URLSearchParams();

		Object.entries(params).forEach(([key, value]) => {
			console.log(
				`🔧 Procesando key="${key}", value=`,
				value,
				"tipo:",
				typeof value,
				"isArray:",
				Array.isArray(value)
			);

			if (value === undefined || value === null) {
				console.log(`  ⏭️ Saltando ${key} (undefined/null)`);
				return; // Skip undefined/null values
			}

			if (Array.isArray(value)) {
				console.log(
					`  📦 ${key} es array con ${value.length} elementos:`,
					value
				);
				// Para arrays, agregar múltiples entradas con la misma clave
				value.forEach((item, index) => {
					if (item !== undefined && item !== null) {
						console.log(`    ➕ Agregando ${key}[${index}] = ${String(item)}`);
						searchParams.append(key, String(item));
					}
				});
			} else {
				console.log(`  ➕ ${key} es valor simple: ${String(value)}`);
				// Para valores simples, agregar normalmente
				searchParams.append(key, String(value));
			}
		});

		console.log("🔧 URLSearchParams generado:", searchParams.toString());
		return searchParams;
	}

	/**
	 * Obtiene una lista paginada de posts desde la API
	 */
	async getPosts(params?: IGetPostsParams): Promise<IGetPostsResponse> {
		// ========================================================================
		// MOCK: Implementación con datos locales
		// ========================================================================
		console.log("📦 [MOCK] PostsAdapter obteniendo posts con params:", params);

		// Simular delay de red
		// await this.simulateNetworkDelay(300);

		// try {
		//   const result = this.filterAndPaginatePosts(MOCK_POSTS, params);

		//   console.log(`📦 [MOCK] Devolviendo ${result.items.length} de ${result.total} posts`);

		//   return result;
		// } catch (error) {
		//   console.error('📦 [MOCK] Error al obtener posts:', error);
		//   throw new Error('Failed to fetch posts from mock data');
		// }

		// ========================================================================
		// BACKEND: Implementación con API REST
		// ========================================================================
		try {
			const queryParams = PostMapper.toGetPostsParamsDto(params);

			// Serializar params para manejar arrays correctamente
			const serializedParams = this.serializeParams(queryParams);
			const queryString = serializedParams.toString();

			console.log("🔍 Query string generado:", queryString);

			const url = queryString
				? `${this.basePath}?${queryString}`
				: this.basePath;

			const response = await httpService.get<GetPostsResponseDto>(url);

			if (!response.success) {
				throw new Error(response.error?.message || "Failed to fetch posts");
			}

			console.log("✅ Response:", response);
			return PostMapper.toGetPostsResponse(response.data!);
		} catch (error) {
			console.error("❌ Error fetching posts:", error);
			throw new Error("Failed to fetch posts from API");
		}
	}

	/**
	 * Crea un nuevo post
	 */
	async createPost(request: ICreatePostRequest): Promise<IPost> {
		try {
			const requestDto: CreatePostRequestDto = {
				name: request.name,
				description: request.description,
				channel: request.channel,
				postType: request.postType,
				date: request.date,
				imageUrl: request.imageUrl,
				aiGenerationType: request.aiGenerationType,
				contentId: request.contentId,
				// Brand config params
				logo: request.logo,
				primaryColor: request.primaryColor,
				secondaryColor: request.secondaryColor,
				brandDescription: request.brandDescription,
				agencyId: request.agencyId,
				companyId: request.companyId,
			};

			const response = await httpService.post<CreatePostResponseDto>(
				this.basePath,
				requestDto
			);

			if (!response.success || !response.data) {
				throw new Error(response.error?.message || "Failed to create post");
			}

			return PostMapper.toDomain(response.data);
		} catch (error) {
			console.error("Error creating post:", error);
			throw new Error("Failed to create post");
		}
	}

	/**
	 * Obtiene un post específico por su ID
	 */
	async getPostById(id: string): Promise<IPost> {
		// ========================================================================
		// MOCK: Implementación con datos locales
		// ========================================================================
		console.log(`📦 [MOCK] PostsAdapter obteniendo post con ID: ${id}`);

		// Simular delay de red
		await this.simulateNetworkDelay(200);

		try {
			const post = MOCK_POSTS.find((p) => p.id === id);

			if (!post) {
				throw new Error(`Post with id ${id} not found in mock data`);
			}

			console.log(`📦 [MOCK] Post encontrado: ${post.name}`);

			return post;
		} catch (error) {
			console.error(`📦 [MOCK] Error al obtener post ${id}:`, error);
			throw error;
		}

		// ========================================================================
		// BACKEND: Implementación con API REST (COMENTADO)
		// ========================================================================
		// try {
		//   const response = await httpService.get<PostDto>(
		//     `${this.basePath}/${id}`
		//   );
		//
		//   if (!response.success) {
		//     throw new Error(response.error?.message || `Failed to fetch post with id ${id}`);
		//   }
		//
		//   return PostMapper.toDomain(response.data!);
		// } catch (error) {
		//   console.error(`Error fetching post ${id}:`, error);
		//   throw new Error(`Failed to fetch post with id ${id}`);
		// }
	}

	/**
	 * Actualiza el estado de un post
	 */
	async updatePostStatus(id: string, state: EnumPostState): Promise<IPost> {
		try {
			const requestDto: UpdatePostStatusRequestDto = {
				state: state,
			};

			const response = await httpService.put<UpdatePostStatusResponseDto>(
				`${this.basePath}/${id}`,
				requestDto
			);

			if (!response.success || !response.data) {
				throw new Error(
					response.error?.message || "Failed to update post status"
				);
			}

			return PostMapper.toDomain(response.data);
		} catch (error) {
			console.error(`Error updating post status for ${id}:`, error);
			throw new Error("Failed to update post status");
		}
	}

	/**
	 * Elimina un post
	 */
	async deletePost(id: string): Promise<void> {
		try {
			const response = await httpService.delete<DeletePostResponseDto>(
				`${this.basePath}/${id}`
			);

			if (!response.success) {
				throw new Error(response.error?.message || "Failed to delete post");
			}
		} catch (error) {
			console.error(`Error deleting post ${id}:`, error);
			throw new Error("Failed to delete post");
		}
	}
}

/**
 * Instancia singleton del adaptador de posts
 */
export const postsAdapter = new PostsAdapter();
