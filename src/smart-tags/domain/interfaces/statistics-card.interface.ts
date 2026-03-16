/**
 * Configuration interface for statistics cards displayed in Smart Tag detail view
 */
export interface IStatisticsCardConfig {
	key: string;
	titleKey: string;
	tooltipKey: string;
	icon: string;
	iconBgColor: string;
	iconColor: string;
	valueKey:
		| "totalUsage"
		| "totalClients"
		| "totalConversations"
		| "campaignsUsage";
}
