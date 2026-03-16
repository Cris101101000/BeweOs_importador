import type { LineChartData } from "../../domain/interfaces/dashboard.interface";
import type {
	IAiTagsStats,
	ICampaignStatsBasic,
	ICampaignStatsMostActiveNetwork,
	IConfigurationProgress,
	IContactsStats,
	IConversationsStats,
	INotificationStats,
	IOpenTimeDistribution,
	OperationalSummaryData,
	ISocialMediaStats,
} from "../../domain/interfaces/dashboard.interface";

// Datos mock para demostración - Escuela Lasa Yoga

export const generateMockLineData = (): LineChartData[] => [
	{ label: "Ene", value: 89 },
	{ label: "Feb", value: 124 },
	{ label: "Mar", value: 156 },
	{ label: "Abr", value: 142 },
	{ label: "May", value: 178 },
	{ label: "Jun", value: 203 },
];

export const mockOperationalData: OperationalSummaryData = {
	totalConversations: 892,
	totalCampaigns: 12,
	followerGrowth: 18.7,
	unusedTags: 8,
	mostActiveNetwork: "Instagram",
	totalAITags: 1245,
	totalNotifications: 2156,
	totalSocialPosts: 234,
	topProducts: [
		"Clases Principiantes",
		"Retiros",
		`Formaci${String.fromCharCode(243)}n Instructores`,
		"Yoga Prenatal",
	],
	activeClients: 1456,
	configurationPercentage: 75,
};

import type { ICampaign, ISocialMediaPost, ILinearGraphDataPoint } from "../../domain/interfaces/dashboard.interface";

export const generateMockCampaignData = (): ICampaign[] => [
	{ name: "Clases Principiantes", openRate: 89.2 },
	{ name: "Retiro Valle de Bravo", openRate: 84.5 },
	{ name: "Pase Ilimitado Verano", openRate: 82.1 },
	{ name: `Formaci${String.fromCharCode(243)}n Instructores`, openRate: 78.9 },
	{ name: `Taller Meditaci${String.fromCharCode(243)}n`, openRate: 76.3 },
];

export const mockCampaignStatsBasic: ICampaignStatsBasic = {
	totalCampaigns: 0,
	totalCampaignsTrend: { value: 0, isPositive: true },
	interactionRate: 0,
	interactionRateTrend: { value: 0, isPositive: true },
};

export const mockCampaignOpenRateRanking: ICampaign[] = [];

export const mockCampaignStatsMostActiveNetwork: ICampaignStatsMostActiveNetwork = {
	conversionRate: 18.5,
	customerAcquisitionCost: 0,
	returnOnInvestment: 0,
};

export const mockAiTagsStats: IAiTagsStats = {
	newTagsPerMonth: 0,
	newTagsPerMonthTrend: 0,
	totalTags: 0,
	tagsInUse: 0,
	topTags: [],
};

/** Mock de estadísticas de contactos (fallback cuando la API falla) */
export const mockContactsStats: IContactsStats = {
	totalContacts: 0,
	totalContactsTrend: null,
	newContacts: 0,
	newContactsTrend: null,
	contactsGeneratedByLinda: 0,
	contactsGeneratedByLindaTrend: null,
};

/** Mock de progreso de configuración (fallback cuando la API falla) */
export const mockConfigurationProgress: IConfigurationProgress = {
	percentageCompleted: 0,
	completedMilestones: 0,
	totalMilestones: 4,
	milestones: {
		hasProductOrService: false,
		hasFirstClient: false,
		hasWhatsAppIntegration: false,
		hasInstagramIntegration: false,
	},
};

export const mockTopSocialPosts: ISocialMediaPost[] = [
	{ title: "Clase especial al atardecer", reach: 14500 },
	{ title: "Reto de 7 dias", reach: 13200 },
	{ title: "Meditacion guiada en vivo", reach: 12150 },
	{ title: "Tips de respiracion", reach: 10980 },
	{ title: "Promo Pase Ilimitado", reach: 9850 },
];

export const mockLinearGraphData: ILinearGraphDataPoint[] = [
	{ name: "00:00", whatsapp: 180, email: 60 },
	{ name: "02:00", whatsapp: 150, email: 45 },
	{ name: "04:00", whatsapp: 120, email: 35 },
	{ name: "06:00", whatsapp: 250, email: 80 },
	{ name: "08:00", whatsapp: 620, email: 180 },
	{ name: "10:00", whatsapp: 780, email: 240 },
	{ name: "12:00", whatsapp: 890, email: 280 },
	{ name: "14:00", whatsapp: 750, email: 260 },
	{ name: "16:00", whatsapp: 820, email: 290 },
	{ name: "18:00", whatsapp: 900, email: 320 },
	{ name: "20:00", whatsapp: 680, email: 250 },
	{ name: "22:00", whatsapp: 420, email: 150 },
];

const MOCK_SOCIAL_REACH = 67800;
export const reachPerPost =
	mockOperationalData.totalSocialPosts > 0
		? Math.round(MOCK_SOCIAL_REACH / mockOperationalData.totalSocialPosts)
		: 0;

export const maxSocialPostReach = Math.max(
	...mockTopSocialPosts.map((post) => post.reach),
);

/** Mock de distribución de tiempo de apertura (fallback cuando la API falla). Estructura alineada con la API real. */
export const mockOpenTimeDistribution: IOpenTimeDistribution = {
	intervals: [
		{ key: "0_1_h", label: "0-1 h", email: 120, whatsapp: 240 },
		{ key: "1_6_h", label: "1-6 h", email: 110, whatsapp: 50 },
		{ key: "6_12_h", label: "6-12 h", email: 65, whatsapp: 95 },
		{ key: "12_24_h", label: "12-24 h", email: 45, whatsapp: 70 },
		{ key: "1_7_d", label: "1-7 d", email: 38, whatsapp: 55 },
		{ key: "plus_7_d", label: "+7 d", email: 50, whatsapp: 120 },
	],
};

/** Mock de estadísticas de conversaciones (fallback cuando la API falla) */
export const mockConversationsStats: IConversationsStats = {
	totalConversations: 892,
	answeredQuestions: 865,
	pendingQuestions: 27,
	pendingGaps: 14,
	totalConversationsTrend: { value: 23.5, isPositive: true },
	answeredQuestionsTrend: { value: 18.2, isPositive: true },
	pendingQuestionsTrend: { value: 1.8, isPositive: false },
	pendingGapsTrend: { value: 3.4, isPositive: false },
};

/** Mock de estadísticas de notificaciones (fallback cuando la API falla) */
const MOCK_DELIVERY_RATE_PCT = 99.2;
const MOCK_READ_RATE_PCT = 78.5;
export const mockNotificationStats: INotificationStats = {
	sentCount: mockOperationalData.totalNotifications,
	deliveredCount: Math.round(
		(mockOperationalData.totalNotifications * MOCK_DELIVERY_RATE_PCT) / 100,
	),
	readCount: Math.round(
		(mockOperationalData.totalNotifications * MOCK_READ_RATE_PCT) / 100,
	),
	readRate: MOCK_READ_RATE_PCT,
	channel: {
		whatsapp: {
			sentCount: 1200,
			readCount: 942,
			readRate: 94.2,
		},
		email: {
			sentCount: 956,
			readCount: 668,
			readRate: 90.2,
		},
	},
};

/** Mock de estadísticas de redes sociales (fallback cuando la API falla) */
export const mockSocialMediaStats: ISocialMediaStats = {
	socialReach: MOCK_SOCIAL_REACH,
	reachPerPost,
	totalPosts: mockOperationalData.totalSocialPosts,
	totalStories: 96,
	network: mockOperationalData.mostActiveNetwork ?? "unknown",
	engagementRate: 12.4,
	likes: 18450,
	followerGrowth: mockOperationalData.followerGrowth,
	topPosts: mockTopSocialPosts,
	maxReach: maxSocialPostReach,
};

