// DTOs para las respuestas de la API del dashboard
// Por ahora usamos los mocks, pero cuando tengamos la API real, estos DTOs mapearán la respuesta

export interface GetDashboardDataResponseDto {
	operationalSummary: unknown; // Se mapeará a OperationalSummaryData
	conversationData: unknown; // Se mapeará a LineChartData[]
	campaignData: unknown; // Se mapeará a Campaign[]
	socialMediaPosts: unknown; // Se mapeará a SocialMediaPost[]
	linearGraphData: unknown; // Se mapeará a LinearGraphDataPoint[]
}

