export interface DashboardAlertItem {
	/** Nombre del icono para IconComponent (ej. "solar:brain-bold"). */
	icon: string;
	titleKey: string;
	descriptionKey: string;
	actionTextKey: string;
	/** Ruta a la que redirigir al hacer click en el action (ej. "/social-networks", "/chatbot?section=knowledge-gaps"). */
	redirectTo: string;
}

export const DASHBOARD_ALERTS: DashboardAlertItem[] = [
	{
		icon: "solar:smartphone-rotate-angle-bold",
		titleKey: "dashboard_alert_social_content",
		descriptionKey: "dashboard_alert_social_content_desc",
		actionTextKey: "dashboard_alert_social_action",
		redirectTo: "/social-networks",
	},
	{
		icon: "solar:user-speak-bold",
		titleKey: "dashboard_alert_knowledge_gaps",
		descriptionKey: "dashboard_alert_knowledge_gaps_desc",
		actionTextKey: "dashboard_alert_knowledge_gaps_action",
		redirectTo: "/chatbot?section=knowledge-gaps",
	},
	{
		icon: "solar:chat-round-dots-bold",
		titleKey: "dashboard_alert_unanswered_conversations",
		descriptionKey: "dashboard_alert_unanswered_conversations_desc",
		actionTextKey: "dashboard_alert_unanswered_conversations_action",
		redirectTo: "/chatbot?section=conversations",
	},
	{
		icon: "solar:target-bold",
		titleKey: "dashboard_alert_suggested_campaign",
		descriptionKey: "dashboard_alert_suggested_campaign_desc",
		actionTextKey: "dashboard_alert_suggested_campaign_action",
		redirectTo: "/campaigns",
	},
];
