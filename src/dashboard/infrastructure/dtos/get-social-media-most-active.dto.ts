/** DTO del body `data` de la respuesta GET /social-media/posts/stats/most-active-network */
export interface GetSocialMediaMostActiveDataDto {
	network: string;
	engagement: number;
	interactionEvents: number;
	totalPosts: number;
}
