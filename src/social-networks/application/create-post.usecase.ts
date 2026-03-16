import type { IPost } from "../domain/interfaces/post.interface";
import type {
	ICreatePostRequest,
	IPostsPort,
} from "../domain/ports/posts.port";

/**
 * Use case: Create a new social media post
 *
 * @param repository - Posts repository implementation
 * @param request - Request containing post data
 * @returns Promise with the created post
 */
export async function createPost(
	repository: IPostsPort,
	request: ICreatePostRequest
): Promise<IPost> {
	return await repository.createPost(request);
}
