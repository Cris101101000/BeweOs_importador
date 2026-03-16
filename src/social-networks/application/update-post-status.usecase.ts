import type { EnumPostState } from "../domain/enums/enum-post-state.enum";
import type { IPost } from "../domain/interfaces/post.interface";
import type { IPostsPort } from "../domain/ports/posts.port";

/**
 * Use case: Update the status of a social media post
 *
 * @param repository - Posts repository implementation
 * @param id - ID of the post to update
 * @param state - New state for the post
 * @returns Promise with the updated post
 */
export async function updatePostStatus(
	repository: IPostsPort,
	id: string,
	state: EnumPostState
): Promise<IPost> {
	return await repository.updatePostStatus(id, state);
}
