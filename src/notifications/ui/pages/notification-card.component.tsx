import { Button, Card, IconComponent, P } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { FC } from "react";
import type { INotification } from "../../../shared/domain/interfaces/notification.interface";
import {
	NOTIFICATION_TYPE_ICON,
	NOTIFICATION_TYPE_COLOR,
	NOTIFICATION_TYPE_BG,
} from "src/layout/domain/constants/notifications-panel.constants";
import { NotificationTypeEnum } from "src/layout/domain/enums/notification-panel.enum";

export interface NotificationCardProps {
	notification: INotification;
	onMarkAsRead: (id: string) => void;
	onNavigate: (href: string) => void;
}

const NotificationCard: FC<NotificationCardProps> = ({
	notification,
	onMarkAsRead,
	onNavigate,
}) => {
	const { t } = useTranslate();

	return (
		<Card
			className={`p-3 transition-all ${!notification.read ? "border-l-4 border-l-primary-500" : ""}`}
		>
			<div className="flex gap-3 items-center">
				<div
					className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${NOTIFICATION_TYPE_BG[notification.type as NotificationTypeEnum]}`}
				>
					<IconComponent
						icon={NOTIFICATION_TYPE_ICON[notification.type as NotificationTypeEnum]}
						className={`h-4 w-4 ${NOTIFICATION_TYPE_COLOR[notification.type as NotificationTypeEnum]}`}
					/>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<P
									className={`text-sm leading-tight truncate ${!notification.read ? "font-semibold" : "font-medium"} text-default-900`}
								>
									{notification.title}
								</P>
								{!notification.read && (
									<span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
								)}
							</div>
							<P className="text-xs text-default-500 truncate">
								{notification.description}
							</P>
							{notification.href && (
								<Button
									size="sm"
									variant="flat"
									color="primary"
									className="mt-1.5"
									onPress={() => onNavigate(notification.href!)}
									startContent={
										<IconComponent
											icon="solar:square-top-down-linear"
											className="h-3.5 w-3.5"
										/>
									}
								>
									{notification.hrefTitle || t("notifications_action_view", "Ver")}
								</Button>
							)}
						</div>
						<div className="flex items-center gap-1 flex-shrink-0">
							<span className="text-xs text-default-400">
								{formatDistanceToNow(notification.createdAt, {
									addSuffix: true,
									locale: es,
								})}
							</span>
							{!notification.read && (
								<Button
									isIconOnly
									variant="light"
									size="sm"
									onPress={() => onMarkAsRead(notification.id)}
									aria-label={t("notifications_mark_read_aria", "Marcar como leída")}
								>
									<IconComponent
										icon="solar:close-circle-line-duotone"
										className="h-4 w-4 text-default-400"
									/>
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
};

NotificationCard.displayName = "NotificationCard";

export default NotificationCard;

