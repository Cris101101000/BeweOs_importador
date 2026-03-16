import type { IPostsPort } from "../domain/ports/posts.port";

/**
 * Use case: Delete a social media post
 *
 * @param repository - Posts repository implementation
 * @param id - ID of the post to delete
 * @returns Promise that resolves when the post is deleted
 */
export async function deletePost(
	repository: IPostsPort,
	id: string
): Promise<void> {
	return await repository.deletePost(id);
}
