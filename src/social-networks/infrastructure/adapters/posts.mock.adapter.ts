import type {
	IGetPostsParams,
	IGetPostsResponse,
	IPost,
} from "../../domain/interfaces/post.interface";
import type { IPostsPort } from "../../domain/ports/posts.port";
import { MOCK_POSTS } from "../mocks/posts.mock";

/**
 * Adaptador mock para el servicio de posts
 * Implementa el puerto IPostsPort usando datos locales
 * Útil para desarrollo y testing sin dependencia de la API
 */
export class PostsMockAdapter implements IPostsPort {
	/**
	 * Simula un delay de red para hacer el mock más realista
	 */
	private async simulateNetworkDelay(ms = 500): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Filtra y pagina los posts según los parámetros
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
	 * Obtiene una lista paginada de posts desde los datos mock
	 */
	async getPosts(params?: IGetPostsParams): Promise<IGetPostsResponse> {
		console.log("📦 [MOCK] Obteniendo posts con params:", params);

		// Simular delay de red
		await this.simulateNetworkDelay(300);

		try {
			const result = this.filterAndPaginatePosts(MOCK_POSTS, params);

			console.log(
				`📦 [MOCK] Devolviendo ${result.items.length} de ${result.total} posts`
			);

			return result;
		} catch (error) {
			console.error("📦 [MOCK] Error al obtener posts:", error);
			throw new Error("Failed to fetch posts from mock data");
		}
	}

	/**
	 * Obtiene un post específico por su ID desde los datos mock
	 */
	async getPostById(id: string): Promise<IPost> {
		console.log(`📦 [MOCK] Obteniendo post con ID: ${id}`);

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
	}
}

/**
 * Instancia singleton del adaptador mock de posts
 */
export const postsMockAdapter = new PostsMockAdapter();
