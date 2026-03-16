import React, { useState, useCallback } from 'react';
import { Tabs, Tab } from "@beweco/aurora-ui";
import { PageHeader } from "@shared/ui/components/page-header";
import { useTranslate } from '@tolgee/react';
import { NotificationViewMode } from "../../domain/enums/notification-view.enum";
import { BusinessNotificationsView } from "../views/business/business-notifications.view";
import { ClientsNotificationsView } from "../views/clients/clients-notifications.view";

export const NotificationsPage: React.FC = () => {
	const { t } = useTranslate();
	const [viewMode, setViewMode] = useState<NotificationViewMode>(NotificationViewMode.Business);

	const handleViewModeChange = useCallback(
		(key: React.Key) => {
			const next = key as NotificationViewMode;
			setViewMode(next);
		},
		[]
	);

	const renderCurrentView = () => {
		switch (viewMode) {
			case NotificationViewMode.Clients:
				return <ClientsNotificationsView />;
			case NotificationViewMode.Business:
			default:
				return <BusinessNotificationsView />;
		}
	};

	return (
		<div className="w-full flex flex-col gap-4">
			{/* Page Header */}
			<PageHeader
				title={t("notifications_page_title", "Notificaciones Automáticas")}
			/>

			{/* View Mode Switcher */}
			<nav
				aria-label={t(
					"notifications_navigation_aria",
					"Navegación de vistas de notificaciones"
				)}
			>
				<Tabs
					aria-label={t("notifications_view_switch_aria", "Cambiar vista")}
					selectedKey={viewMode}
					onSelectionChange={handleViewModeChange}
				>
					<Tab
						key={NotificationViewMode.Business}
						className="w-28"
						title={t("notifications_tab_business", "Internas")}
					/>
					<Tab
						key={NotificationViewMode.Clients}
						className="w-28"
						title={t("notifications_tab_clients", "Clientes")}
					/>
				</Tabs>
			</nav>

			{/* Main Content Area */}
			<main
				aria-label={t(
					"notifications_main_content_aria",
					"Contenido principal de notificaciones"
				)}
			>
				{renderCurrentView()}
			</main>
		</div>
	);
};
