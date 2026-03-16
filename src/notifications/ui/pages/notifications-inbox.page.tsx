import { Button, Card, H2, IconComponent, P } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import {
	useNotificationsStore,
} from "../../../shared/ui/store/useNotificationsStore";
import {
	MarkNotificationAsRead,
	MarkAllNotificationsAsRead,
} from "../../../layout/ui/components/notifications-panel/DependencyInjection";
import NotificationCard from "./notification-card.component";

export const NotificationsInboxPage: FC = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();

	const {
		notifications,
		markAsRead,
		markAllAsRead,
	} = useNotificationsStore(
		useShallow((state) => ({
			notifications: state.notifications,
			markAsRead: state.markAsRead,
			markAllAsRead: state.markAllAsRead,
		}))
	);

	const unreadNotifications = notifications.filter((n) => !n.read);
	const readNotifications = notifications.filter((n) => n.read);

	const handleMarkAsRead = useCallback(
		(id: string) => {
			markAsRead(id);
			MarkNotificationAsRead(id);
		},
		[markAsRead]
	);

	const handleMarkAllAsRead = useCallback(() => {
		markAllAsRead();
		MarkAllNotificationsAsRead();
	}, [markAllAsRead]);

	const handleNavigate = useCallback(
		(href: string) => {
			navigate(href);
		},
		[navigate]
	);

	return (
		<div className="max-w-3xl mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<H2>{t("notifications_inbox_title", "Bandeja de notificaciones")}</H2>
					{unreadNotifications.length > 0 && (
						<span className="px-2.5 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full">
							{unreadNotifications.length} {t("notifications_unread", "sin leer")}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					{unreadNotifications.length > 0 && (
						<Button
							variant="flat"
							color="primary"
							size="sm"
							onPress={handleMarkAllAsRead}
							startContent={
								<IconComponent icon="solar:check-read-outline" className="h-4 w-4" />
							}
						>
							{t("notifications_mark_all_read", "Marcar todas como leídas")}
						</Button>
					)}
					{unreadNotifications.length > 0 && (
						<Button
							variant="flat"
							color="danger"
							size="sm"
							onPress={handleMarkAllAsRead}
							startContent={
								<IconComponent icon="solar:check-read-outline" className="h-4 w-4" />
							}
						>
							{t("notifications_clear_all", "Limpiar todo")}
						</Button>
					)}
				</div>
			</div>

			{/* Empty state */}
			{notifications.length === 0 && (
				<Card className="p-12">
					<div className="flex flex-col items-center justify-center text-center">
						<IconComponent
							icon="solar:bell-off-line-duotone"
							className="h-16 w-16 text-default-300 mb-4"
						/>
						<P className="text-lg font-medium text-default-700 mb-2">
							{t("notifications_inbox_empty_title", "No tienes notificaciones")}
						</P>
						<P className="text-default-500">
							{t("notifications_inbox_empty_description", "Cuando recibas notificaciones, aparecerán aquí")}
						</P>
					</div>
				</Card>
			)}

			{/* Unread notifications */}
			{unreadNotifications.length > 0 && (
				<div className="mb-8">
					<P className="text-sm font-semibold text-default-600 mb-3 uppercase tracking-wide">
						{t("notifications_unread_section", "No leídas")}
					</P>
					<div className="flex flex-col gap-3">
						{unreadNotifications.map((notification) => (
							<NotificationCard
								key={notification.id}
								notification={notification}
								onMarkAsRead={handleMarkAsRead}
								onNavigate={handleNavigate}
							/>
						))}
					</div>
				</div>
			)}

			{/* Read notifications */}
			{readNotifications.length > 0 && (
				<div>
					<P className="text-sm font-semibold text-default-600 mb-3 uppercase tracking-wide">
						{t("notifications_read_section", "Leídas")}
					</P>
					<div className="flex flex-col gap-3">
						{readNotifications.map((notification) => (
							<NotificationCard
								key={notification.id}
								notification={notification}
								onMarkAsRead={handleMarkAsRead}
								onNavigate={handleNavigate}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationsInboxPage;
