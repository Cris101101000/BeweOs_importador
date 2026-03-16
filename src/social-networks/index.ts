/**
 * Social Networks Module - Main Export
 *
 * Este módulo implementa la funcionalidad de gestión de posts de redes sociales
 * siguiendo la arquitectura hexagonal (Puertos y Adaptadores).
 *
 * @module social-networks
 */

// ============================================================================
// DOMAIN EXPORTS
// ============================================================================

// Enums
export {
	EnumPostState,
	EnumChannel,
	EnumPostType,
	EnumAIGenerationType,
} from "./domain/enums";

// Interfaces
export type {
	IPost,
	IGetPostsParams,
	IGetPostsResponse,
} from "./domain/interfaces/post.interface";

// Ports
export type { IPostsPort } from "./domain/ports/posts.port";

// ============================================================================
// INFRASTRUCTURE EXPORTS
// ============================================================================

// Adapters
export {
	PostsAdapter,
	postsAdapter,
} from "./infrastructure/adapters/posts.adapter";
export {
	PostsMockAdapter,
	postsMockAdapter,
} from "./infrastructure/adapters/posts.mock.adapter";

// DTOs
export type {
	PostDto,
	GetPostsResponseDto,
	GetPostsParamsDto,
} from "./infrastructure/dtos/post.dto";

// Mappers
export { PostMapper } from "./infrastructure/mappers/post.mapper";

// Mocks
export {
	MOCK_POSTS,
	getTotalMockPosts,
} from "./infrastructure/mocks/posts.mock";

// ============================================================================
// CONFIGURATION EXPORTS
// ============================================================================

export {
	configuredPostsAdapter,
	getPostsAdapter,
} from "./config/adapter.config";

// ============================================================================
// APPLICATION EXPORTS
// ============================================================================

// Use Cases
export { getPostsUseCase } from "./application/get-posts.usecase";
export { getPostByIdUseCase } from "./application/get-post-by-id.usecase";

// ============================================================================
// UI EXPORTS
// ============================================================================

// Hooks
export { usePostsHistory } from "./ui/content-history/hooks/use-posts-history.hook";
