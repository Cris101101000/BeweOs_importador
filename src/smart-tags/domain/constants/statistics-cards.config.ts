import type { IStatisticsCardConfig } from "../interfaces/statistics-card.interface";

/**
 * Configuration for statistics cards displayed in Smart Tag detail view
 */
export const STATISTICS_CARDS_CONFIG: IStatisticsCardConfig[] = [
	{
		key: "totalUsage",
		titleKey: "smart_tags_statistics_total_usage_title",
		tooltipKey: "smart_tags_statistics_total_usage_tooltip",
		icon: "solar:chart-bold",
		iconBgColor: "bg-success-100",
		iconColor: "text-success-600",
		valueKey: "totalUsage",
	},
	{
		key: "clients",
		titleKey: "smart_tags_statistics_clients_title",
		tooltipKey: "smart_tags_statistics_clients_tooltip",
		icon: "solar:user-bold",
		iconBgColor: "bg-primary-100",
		iconColor: "text-primary-600",
		valueKey: "totalClients",
	},
	{
		key: "conversations",
		titleKey: "smart_tags_statistics_conversations_title",
		tooltipKey: "smart_tags_statistics_conversations_tooltip",
		icon: "solar:chat-round-dots-bold",
		iconBgColor: "bg-purple-100",
		iconColor: "text-purple-600",
		valueKey: "totalConversations",
	},
	{
		key: "notes",
		titleKey: "smart_tags_statistics_notes_title",
		tooltipKey: "smart_tags_statistics_notes_tooltip",
		icon: "solar:document-text-bold",
		iconBgColor: "bg-amber-100",
		iconColor: "text-amber-600",
		valueKey: "totalNotes",
	},
	// TODO: Add campaigns when implemented
	// {
	//   key: 'campaigns',
	//   titleKey: 'smart_tags_statistics_campaigns_title',
	//   tooltipKey: 'smart_tags_statistics_campaigns_tooltip',
	//   icon: 'solar:rocket-bold',
	//   iconBgColor: 'bg-orange-100',
	//   iconColor: 'text-orange-600',
	//   valueKey: 'campaignsUsage',
	// },
];
