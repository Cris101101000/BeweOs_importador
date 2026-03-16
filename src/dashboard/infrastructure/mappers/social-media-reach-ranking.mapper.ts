import type { ISocialMediaPost } from "../../domain/interfaces/dashboard.interface";
import type { SocialMediaReachRankingItemDto } from "../dtos/get-social-media-reach-ranking.dto";

/**
 * Mapea el array de GET /social-media/posts/stats/reach-ranking a ISocialMediaPost[].
 */
export const toSocialMediaReachRankingFromDto = (
	dtos: SocialMediaReachRankingItemDto[]
): ISocialMediaPost[] =>
	dtos.map((dto) => ({ title: dto.title, reach: dto.reach }));
