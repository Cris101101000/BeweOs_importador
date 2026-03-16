import type { GetSocialMediaBasicDataDto } from "../dtos/get-social-media-basic.dto";

/**
 * Mapea la respuesta de GET /social-media/posts/stats/basic al modelo de dominio.
 * totalReach -> socialReach, averageReach -> reachPerPost.
 */
export const toSocialMediaBasicFromDto = (
	dto: GetSocialMediaBasicDataDto
): { socialReach: number; reachPerPost: number; totalPosts: number } => ({
	socialReach: dto.totalReach,
	reachPerPost: dto.averageReach,
	totalPosts: dto.totalPosts,
});
