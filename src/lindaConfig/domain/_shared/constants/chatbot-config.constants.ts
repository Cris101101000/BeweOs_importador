export const CHATBOT_CONFIG_TABS = [
	{
		key: "conversations",
		translationKey: "linda_config_tab_conversations",
	},
	{
		key: "quick-starts",
		translationKey: "linda_config_tab_quick_starts",
	},
	{
		key: "knowledge-gaps",
		translationKey: "linda_config_tab_knowledge_gaps",
	},
	{
		key: "upload",
		translationKey: "linda_config_tab_upload_info",
	},
	{
		key: "faqs",
		translationKey: "linda_config_tab_faqs",
	},
	{
		key: "behavior-rules",
		translationKey: "linda_config_tab_behavior_rules",
	},
	{
		key: "share",
		translationKey: "linda_config_tab_share",
	},
] as const;

export type ChatbotConfigTabKey = (typeof CHATBOT_CONFIG_TABS)[number]["key"];

export const DEFAULT_CHATBOT_CONFIG_TAB: ChatbotConfigTabKey = "conversations";

