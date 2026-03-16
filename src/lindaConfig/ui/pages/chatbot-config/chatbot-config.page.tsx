import {
	Button,
	Card,
	IconComponent,
	Modal,
	ModalContent,
	Tab,
	Tabs,
} from "@beweco/aurora-ui";
import { PageHeader } from "@shared/ui/components/page-header";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	CHATBOT_CONFIG_TABS,
	type ChatbotConfigTabKey,
} from "../../../domain/_shared/constants";

import { BehaviorRulesScreen } from "../../features/behavior-rules/screens";
// Feature screens
import { ConversationsScreen } from "../../features/conversations/screens";
import { FAQScreen } from "../../features/faq/screens";
import { IngestionScreen } from "../../features/ingestion/screens";
import { KnowledgeGapsScreen } from "../../features/knowledge-gaps/screens";
import { QuickStartsScreen } from "../../features/quick-starts/screens";
import { ShareScreen } from "../../features/share/screens";

// Hooks
import { useChannels } from "../../_shared";
import { useTabUrlSync } from "./hooks";

export interface ChatbotConfigPageProps {
	businessId: string;
}

export const ChatbotConfigPage: React.FC<ChatbotConfigPageProps> = () => {
	const navigate = useNavigate();
	const { t } = useTranslate();

	const [showChannelBanner, setShowChannelBanner] = useState(true);
	const [showChatModal, setShowChatModal] = useState(false);

	// Tab URL sync
	const { activeTab, handleTabChange } = useTabUrlSync();

	// Estado de canales de integración
	const { channelStatus } = useChannels();

	const unconfiguredChannels = Object.entries(channelStatus)
		.filter(([, isConfigured]) => !isConfigured)
		.map(([channel]) => channel);

	const hasUnconfiguredChannels = unconfiguredChannels.length > 0;

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			console.log('event.data.event >>',event.data.event);
			if (event.data.event === "chat:close") {
				setShowChatModal(false);
			}
		};

		window.addEventListener("message", handleMessage);

		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	return (
		<div className="flex flex-col h-full space-y-6">
			{/* Header */}
			<header className="flex flex-col space-y-4">
				<PageHeader
					title={t("linda_config_page_title")}
					actions={
						<Button
							variant="solid"
							size="sm"
							color="primary"
							onPress={() => setShowChatModal(true)}
							endContent={
								<IconComponent
									icon="solar:chat-round-dots-bold"
									className="w-4 h-4"
								/>
							}
						>
							{t("linda_config_talk_to_bot")}
						</Button>
					}
				/>

				{/* Main Navigation Tabs */}
				<div className="overflow-x-auto pb-1">
					<Tabs
						selectedKey={activeTab}
						onSelectionChange={(key) =>
							handleTabChange(key as ChatbotConfigTabKey)
						}
						aria-label="Secciones de configuración del chatbot"
						classNames={{
							tabList: "flex-nowrap",
							tab: "whitespace-nowrap",
						}}
					>
						{CHATBOT_CONFIG_TABS.map((tab) => (
							<Tab key={tab.key} title={t(tab.translationKey)} />
						))}
					</Tabs>
				</div>

				{/* Channel Status Banner */}
				{hasUnconfiguredChannels && showChannelBanner && (
					<Card className="border-0 rounded-2xl bg-gradient-to-b from-orange-50 to-white shadow-sm relative p-3">
						<div className="p-2">
							{/* Close Button - Top Right */}
							<Button
								isIconOnly
								variant="light"
								size="sm"
								onPress={() => setShowChannelBanner(false)}
								className="absolute top-1 right-1 text-default-400 hover:text-default-600"
							>
								<IconComponent icon="solar:close-circle-outline" size="sm" />
							</Button>
							<div className="flex items-center gap-2 pr-8">
								{/* Warning Icon */}
								<div className="flex-shrink-0">
									<div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
										<IconComponent
											icon="solar:danger-triangle-bold"
											className="text-orange-600"
											size="sm"
										/>
									</div>
								</div>
								{/* Text Content */}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-default-900">
										{t("linda_config_banner_connect_channels")}
									</p>
									<p className="text-xs text-default-700 mt-0.5">
										{t("linda_config_banner_available_channels")}
									</p>
								</div>
								{/* Action Buttons */}
								<div className="flex items-center gap-2 flex-shrink-0">
									<Button
										variant="flat"
										size="sm"
										color="primary"
										onPress={() => navigate("/integrations")}
										startContent={
											<IconComponent icon="solar:link-bold" size="sm" />
										}
									>
										{t("button_configure")}
									</Button>
								</div>
							</div>
						</div>
					</Card>
				)}
			</header>

			{/* Tab Content */}
			{activeTab === "conversations" && <ConversationsScreen showChannelBanner={showChannelBanner} />}
			{activeTab === "quick-starts" && <QuickStartsScreen />}
			{activeTab === "knowledge-gaps" && <KnowledgeGapsScreen />}
			{activeTab === "upload" && <IngestionScreen />}
			{activeTab === "faqs" && <FAQScreen />}
			{activeTab === "behavior-rules" && <BehaviorRulesScreen />}
			{activeTab === "share" && <ShareScreen />}

			{/* Chat Modal */}
			<Modal
				isOpen={showChatModal}
				onClose={() => setShowChatModal(false)}
				size="5xl"
				scrollBehavior="inside"
				hideCloseButton={true}
				classNames={{
					base: "max-h-[95vh] rounded-2xl",
					body: "p-0 rounded-2xl",
					header: "p-0",
					wrapper: "p-0",
					footer: "border-t border-gray-200 max-h-[200px] overflow-y-auto",
				}}
			>
				<ModalContent className="bg-white w-full h-[95vh] p-0 rounded-2xl overflow-hidden">
					<iframe
						src={`${process.env.REACT_APP_CHATBOT_BASE_URL}/${window.USER_SESSION?.pk || ""}?context=preview`}
						className="h-full w-full rounded-2xl"
						title={t("linda_config_chat_modal_title")}
						allow="camera; microphone; fullscreen"
						sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-messages allow-imframes"
					/>
				</ModalContent>
			</Modal>
		</div>
	);
};
