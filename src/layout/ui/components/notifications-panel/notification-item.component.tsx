import { Button, IconComponent, P } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { type FC, memo, useMemo } from "react";
import type { INotification } from "../../../../shared/domain/interfaces/notification.interface";
import { getNotificationType } from "src/layout/domain/utils/notifications-panel.utils";

export interface NotificationItemProps {
	notification: INotification;
	onRead: (id: string) => void;
	onClick?: (href: string) => void;
}

const NotificationItem: FC<NotificationItemProps> = memo(
	({ notification, onRead, onClick }) => {
		const { t } = useTranslate();

		const notificationType = useMemo(
			() => getNotificationType(notification.type),
			[notification.type]
		);

		return (
			<div
				className={`
					relative flex gap-3 p-3 transition-colors
					${!notification.read ? "bg-primary-50/50" : ""}
				`}
			>
				<div className="flex-shrink-0 mt-0.5">
					<IconComponent
						icon={notificationType.icon}
						className={`h-5 w-5 ${notificationType.color}`}
					/>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<P
							className={`text-sm leading-tight ${!notification.read ? "font-semibold" : "font-medium"} text-default-900`}
						>
							{notification.title}
						</P>
						{!notification.read && (
							<button
								type="button"
								onClick={() => onRead(notification.id)}
								className="flex-shrink-0 p-1 rounded-full hover:bg-default-200 transition-colors"
								aria-label={t("notifications_mark_read_aria", "Marcar como leída")}
							>
								<IconComponent
									icon="solar:close-circle-line-duotone"
									className="h-4 w-4 text-default-400"
								/>
							</button>
						)}
					</div>
					<span className="text-xs line-clamp-2 mt-0.5 block text-default-500">
						{notification.description}
					</span>
					<span className="text-xs text-default-400 mt-1 block">
						{formatDistanceToNow(notification.createdAt, {
							addSuffix: true,
							locale: es,
						})}
					</span>
					{notification.href && (
						<Button
							size="sm"
							variant="flat"
							color="primary"
							className="mt-1.5"
							onPress={() => {
								window.open(notification.href!, "_blank", "noopener,noreferrer");
								onClick?.(notification.href!);
							}}
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
			</div>
		);
	}
);

NotificationItem.displayName = "NotificationItem";

export default NotificationItem;

