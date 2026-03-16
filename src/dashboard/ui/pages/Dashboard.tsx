import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@tolgee/react";
import { H3, P, Tabs, Tab } from "@beweco/aurora-ui";
import { useSession } from "../../../shared/ui/contexts/session-context/session-context";
import {
	OperationalSummary,
	LindaRecommendationCard,
	ConversationsSection,
	NotificationsSection,
	SocialMediaSection,
	CampaignPerformanceSection,
	AITagsSection,
	ContactsSection,
} from "../components";
import { PageHeader } from "@shared/ui/components/page-header";
import { useDashboard } from "../hooks";
import {
	DASHBOARD_ALERTS,
	type DashboardAlertItem,
} from "../constants/dashboard-alerts.constants";

const Dashboard = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();
	const { user, agency } = useSession();
	const [activeTab, setActiveTab] = useState<'communications' | 'business'>('communications');
	const [openTimePeriod, setOpenTimePeriod] = useState<"Mensual" | "Semanal">("Mensual");

	const [expandedSections, setExpandedSections] = useState({
		campaigns: false,
		conversationsAlt: false,
		notifications: false,
		socialMedia: false,
		aiTags: false,
		contacts: false,
	});

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections(prev => ({
			...prev,
			[section]: !prev[section]
		}));
	};

	const getAlertRedirectHandler = useCallback(
		(redirectTo: string) => () => {
			if (redirectTo.startsWith("http://") || redirectTo.startsWith("https://")) {
				window.open(redirectTo, "_blank", "noopener,noreferrer");
			} else {
				navigate(redirectTo);
			}
		},
		[navigate]
	);

	const dashboardParams = useMemo(
		() => ({ openTimePeriod, agencyId: agency?.id }),
		[openTimePeriod, agency?.id]
	);
	const { data: dashData } = useDashboard(dashboardParams);

	const dashboardData = dashData.dashboardData;
	const notificationStats = dashData.notificationStats;
	const conversationsStats = dashData.conversationsStats;
	const socialMediaStats = dashData.socialMediaStats;
	const campaignStats = dashData.campaignStats;
	const tagsStats = dashData.tagsStats;
	const contactsStats = dashData.contactsStats;
	const assistantSuggestions = dashData.assistantSuggestions ?? [];
	const conversationData = dashboardData?.conversationData ?? [];
	const operationalSummaryData = dashData.operationalSummary;
	const linearGraphData = dashData.openTimeDistributionData ?? [];

	const alertsToShow = useMemo(() => {
		if (assistantSuggestions.length > 0) {
			return assistantSuggestions.map((a) => ({
				id: a.id,
				icon: a.icon,
				title: a.title,
				description: a.description,
				actionText: a.actionText,
				redirectTo: a.redirectTo,
				isFromApi: true,
			}));
		}

		//si no hay sugerencias de Linda, se muestran las sugerencias estáticas
		return DASHBOARD_ALERTS.map((a: DashboardAlertItem, index: number) => ({
			id: `static-${index}-${a.redirectTo}`,
			icon: a.icon,
			title: t(a.titleKey),
			description: t(a.descriptionKey),
			actionText: t(a.actionTextKey),
			redirectTo: a.redirectTo,
			isFromApi: false,
		}));
	}, [assistantSuggestions, t]);

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={t("module_dashboard", "Dashboard")} />
			<P className="text-sm text-default-600">
				{t("dashboard_welcome", "Bienvenido al panel principal.")}
			</P>
		
		{/* Resumen Operativo (datos de configuration-progress + stats del dashboard) - oculto cuando configuración está al 100% */}
		{operationalSummaryData?.configurationPercentage !== 100 && (
			<OperationalSummary data={operationalSummaryData} className="mb-0" user={user} />
		)}

		{/* Sección de Alertas */}
		<div className="-mb-0.5">
			<H3 className="text-base font-semibold text-gray-900 mb-0">
				{t("dashboard_alerts_section_title")}
			</H3>
			<P className="text-sm text-gray-600 mb-1.5">
				{t("dashboard_alerts_section_description")}
			</P>
		</div>
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
			{alertsToShow.map((alert) => (
				<LindaRecommendationCard
					key={alert.redirectTo}
					icon={alert.icon}
					title={alert.title}
					description={alert.description}
					actionText={alert.actionText}
					onActionClick={getAlertRedirectHandler(alert.redirectTo)}
				/>
			))}
		</div>

			{/* Tabs de navegación */}
			<Tabs
				selectedKey={activeTab}
				onSelectionChange={(key) => setActiveTab(key as 'communications' | 'business')}
				aria-label="Dashboard navigation tabs"
			>
				<Tab
					key="communications"
					title={t('dashboard_tab_communications', 'Comunicaciones')}
				/>
				<Tab
					key="business"
					title={t('dashboard_tab_business', 'Gestión de Negocio')}
				/>
			</Tabs>

		{/* Contenido del tab Comunicaciones */}
		{activeTab === 'communications' && (
			<>
				<ConversationsSection
					isExpanded={expandedSections.conversationsAlt}
					onToggle={() => toggleSection('conversationsAlt')}
					conversationData={conversationData}
					conversationsStats={conversationsStats}
				/>

				<NotificationsSection
					isExpanded={expandedSections.notifications}
					onToggle={() => toggleSection('notifications')}
					data={notificationStats}
					linearGraphData={linearGraphData}
					openTimePeriod={openTimePeriod}
					onOpenTimePeriodChange={setOpenTimePeriod}
				/>

				<SocialMediaSection
					isExpanded={expandedSections.socialMedia}
					onToggle={() => toggleSection('socialMedia')}
					data={socialMediaStats}
				/>

				<CampaignPerformanceSection
					isExpanded={expandedSections.campaigns}
					onToggle={() => toggleSection('campaigns')}
					data={campaignStats}
				/>
							</>
			)}

			{/* Contenido del tab Gestión de Negocio */}
			{activeTab === 'business' && (
				<>
					<AITagsSection
						isExpanded={expandedSections.aiTags}
						onToggle={() => toggleSection('aiTags')}
						data={tagsStats}
					/>

					<ContactsSection
						isExpanded={expandedSections.contacts}
						onToggle={() => toggleSection('contacts')}
						data={contactsStats}
					/>
				</>
			)}
		</div>
	);
};

export default Dashboard;