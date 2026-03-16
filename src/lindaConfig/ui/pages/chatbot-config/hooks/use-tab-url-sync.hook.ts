import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
	CHATBOT_CONFIG_TABS,
	type ChatbotConfigTabKey,
	DEFAULT_CHATBOT_CONFIG_TAB,
} from "../../../../domain/_shared/constants";

const SECTION_PARAM = "section";

const isValidTabKey = (key: string): key is ChatbotConfigTabKey => {
	return CHATBOT_CONFIG_TABS.some((tab) => tab.key === key);
};

export const useTabUrlSync = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// Get initial tab from URL or use default
	const getInitialTab = useCallback((): ChatbotConfigTabKey => {
		const sectionFromUrl = searchParams.get(SECTION_PARAM);
		if (sectionFromUrl && isValidTabKey(sectionFromUrl)) {
			return sectionFromUrl;
		}
		return DEFAULT_CHATBOT_CONFIG_TAB;
	}, [searchParams]);

	const [activeTab, setActiveTab] =
		useState<ChatbotConfigTabKey>(getInitialTab);

	// Sync URL when tab changes
	const handleTabChange = useCallback(
		(key: ChatbotConfigTabKey) => {
			setActiveTab(key);
			setSearchParams({ [SECTION_PARAM]: key }, { replace: true });
		},
		[setSearchParams]
	);

	// Sync tab state when URL changes (e.g., browser back/forward)
	useEffect(() => {
		const sectionFromUrl = searchParams.get(SECTION_PARAM);
		if (
			sectionFromUrl &&
			isValidTabKey(sectionFromUrl) &&
			sectionFromUrl !== activeTab
		) {
			setActiveTab(sectionFromUrl);
		}
	}, [searchParams, activeTab]);

	return {
		activeTab,
		handleTabChange,
	};
};
