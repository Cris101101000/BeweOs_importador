import type { GetSocialMediaMostActiveDataDto } from "../dtos/get-social-media-most-active.dto";

/**
 * Mapea la respuesta de GET /social-media/posts/stats/most-active-network al modelo de dominio.
 * engagement -> engagementRate (participación), interactionEvents -> likes, totalPosts -> followerGrowth (seguidores).
 */
export const toSocialMediaMostActiveFromDto = (
	dto: GetSocialMediaMostActiveDataDto
): {
	network: string;
	engagementRate: number;
	likes: number;
	followerGrowth: number;
} => ({
	network: dto.network,
	engagementRate: dto.engagement,
	likes: dto.interactionEvents,
	followerGrowth: 0//dto.totalPosts,
});
