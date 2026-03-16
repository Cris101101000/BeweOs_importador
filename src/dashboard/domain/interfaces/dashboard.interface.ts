/** Formato de punto para gráficos de línea (label/value). Usado por SimpleLineChart en conversaciones. */
export interface LineChartData {
	label: string;
	value: number;
}

/** Datos del resumen operativo (construido en useDashboard desde configuration-progress + stats). Solo campos usados por OperationalSummary. */
export interface OperationalSummaryData {
	totalConversations: number;
	totalCampaigns: number;
	followerGrowth: number;
	unusedTags: number;
	mostActiveNetwork: string;
	totalAITags: number;
	totalNotifications: number;
	totalSocialPosts: number;
	topProducts: string[];
	activeClients: number;
	/** Porcentaje desde API GET /companies/me/configuration-progress; si existe se usa en la gráfica. */
	configurationPercentage?: number;
}

export interface ICampaign {
	name: string;
	openRate: number;
}

export interface ISocialMediaPost {
	title: string;
	reach: number;
}

export interface ILinearGraphDataPoint {
	name: string;
	whatsapp: number;
	email: number;
}

export interface IDashboardData {
	operationalSummary: OperationalSummaryData;
	conversationData: LineChartData[];
	campaignData: ICampaign[];
	socialMediaPosts: ISocialMediaPost[];
	linearGraphData: ILinearGraphDataPoint[];
}

export interface IGetDashboardDataRequest {
	// Puede incluir filtros de fecha, período, etc. en el futuro
	startDate?: Date;
	endDate?: Date;
	period?: string;
}

/** Estadísticas por canal (whatsapp, email) */
export interface INotificationChannelStats {
	sentCount: number;
	readCount: number;
	readRate: number;
}

/** Estadísticas generales de notificaciones para el dashboard */
export interface INotificationStats {
	sentCount: number;
	deliveredCount: number;
	readCount: number;
	readRate: number;
	channel: {
		whatsapp: INotificationChannelStats;
		email: INotificationChannelStats;
	};
}

export interface IGetNotificationStatsRequest {
	dateFrom: string; // ISO string
	dateTo: string;   // ISO string
}

/** Intervalo de la distribución de tiempo de apertura (ej. "0-1 h") */
export interface IOpenTimeDistributionInterval {
	key: string;
	label: string;
	email: number;
	whatsapp: number;
}

/** Respuesta de distribución de tiempo de apertura */
export interface IOpenTimeDistribution {
	intervals: IOpenTimeDistributionInterval[];
}

/** Request para GET /notifications/stats/open-time-distribution */
export interface IGetOpenTimeDistributionRequest {
	dateFrom: string; // ISO string
	dateTo: string;   // ISO string
}

/** Estadísticas de conversaciones (Linda chat-sessions) para el dashboard */
export interface IConversationsStats {
	totalConversations: number;
	answeredQuestions: number;
	pendingQuestions: number;
	pendingGaps: number;
	totalConversationsTrend?: IContactsStatsTrend | null;
	answeredQuestionsTrend?: IContactsStatsTrend | null;
	pendingQuestionsTrend?: IContactsStatsTrend | null;
	pendingGapsTrend?: IContactsStatsTrend | null;
}

/** Request para GET /linda/chat-sessions/stats */
export interface IGetConversationsStatsRequest {
	dateFrom?: string; // ISO string
	dateTo?: string;   // ISO string
	channelName?: string[]; // ej. ["web", "whatsapp"]
}

/** Request para GET /linda/chat-sessions/stats/monthly (gráfico últimos meses) */
export interface IGetConversationsStatsMonthlyRequest {
	channelName?: string[];
	timezone?: string;
	agencyId?: string;
}

/** Respuesta del endpoint monthly: lista de meses con totalConversations */
export interface IConversationsStatsMonthly {
	monthlyConversations: Array<{ month: string; totalConversations: number }>;
}

/** Request para endpoints de social-media (dateFrom, dateTo) */
export interface IGetSocialMediaStatsRequest {
	dateFrom: string; // ISO string
	dateTo: string;   // ISO string
}

/** Request para GET /campaigns/stats/basic (dateFrom, dateTo) */
export interface IGetCampaignStatsBasicRequest {
	dateFrom: string; // ISO string
	dateTo: string;   // ISO string
}

/** Estadísticas básicas de campañas para el dashboard */
export interface ICampaignStatsBasic {
	totalCampaigns: number;
	totalCampaignsTrend: { value: number; isPositive: boolean };
	interactionRate: number;
	interactionRateTrend: { value: number; isPositive: boolean };
}

/** Estadísticas operativas de campañas (conversión, CAC, ROI) - GET /campaigns/stats/most-active-network */
export interface ICampaignStatsMostActiveNetwork {
	conversionRate: number;
	customerAcquisitionCost: number;
	returnOnInvestment: number;
}

/** Data unificada de campañas para el dashboard (basic + most-active-network + open-rate-ranking) */
export interface ICampaignStats {
	totalCampaigns: number;
	totalCampaignsTrend?: { value: number; isPositive: boolean };
	interactionRate: number;
	interactionRateTrend?: { value: number; isPositive: boolean };
	campaignRanking: ICampaign[];
	conversionRate: string;
	customerAcquisitionCost: number;
	returnOnInvestment: number;
}

/** Request para GET /tags/stats/ai */
export interface IGetTagsStatsRequest {
	dateFrom: string;
	dateTo: string;
	granularity?: string;
	timezone?: string;
	topN?: number;
}

/** Item de periodo en aiCreatedByPeriod (API) */
export interface IAiCreatedByPeriodItem {
	periodStart: string;
	periodEnd: string;
	count: number;
}

/** Item de top tag para la sección de etiquetas IA */
export interface IAiTagTopItem {
	label: string;
	count: number;
	color: "success" | "primary" | "warning" | "secondary" | "default";
}

/** Estadísticas de etiquetas IA para el dashboard - GET /tags/stats/ai */
export interface IAiTagsStats {
	newTagsPerMonth: number;
	newTagsPerMonthTrend: number;
	totalTags: number;
	tagsInUse: number;
	topTags: IAiTagTopItem[];
}

/** Request para GET /clients/stats (estadísticas de contactos/clientes) */
export interface IGetContactsStatsRequest {
	granularity?: string;
	timezone?: string;
	dateFrom?: string;
	dateTo?: string;
}

/** Trend opcional para una métrica (valor porcentual y si es positivo) */
export interface IContactsStatsTrend {
	value: number;
	isPositive: boolean;
}

/** Estadísticas de contactos para el dashboard - GET /clients/stats */
export interface IContactsStats {
	totalContacts: number;
	totalContactsTrend: IContactsStatsTrend | null;
	newContacts: number;
	newContactsTrend: IContactsStatsTrend | null;
	contactsGeneratedByLinda: number;
	contactsGeneratedByLindaTrend: IContactsStatsTrend | null;
}

/** Progreso de configuración - GET /companies/me/configuration-progress */
export interface IConfigurationProgressMilestones {
	hasProductOrService: boolean;
	hasFirstClient: boolean;
	hasWhatsAppIntegration: boolean;
	hasInstagramIntegration: boolean;
}

export interface IConfigurationProgress {
	percentageCompleted: number;
	completedMilestones: number;
	totalMilestones: number;
	milestones: IConfigurationProgressMilestones;
}
/** Alertas de sugerencias de Linda desde GET /channels/messages?category=assistant_suggestion (para cards del dashboard) */
export interface IAssistantSuggestionAlert {
	id: string;
	icon: string;
	title: string;
	description: string;
	actionText: string;
	redirectTo: string;
}

/** Data unificada de redes sociales para el dashboard (3 endpoints: basic, most-active-network, reach-ranking) */
export interface ISocialMediaStats {
	socialReach: number;
	reachPerPost: number;
	totalPosts: number;
	totalStories: number;
	network: string;
	engagementRate: number;
	likes: number;
	followerGrowth: number;
	topPosts: ISocialMediaPost[];
	maxReach: number;
}

