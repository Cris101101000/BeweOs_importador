import { IconComponent, P } from "@beweco/aurora-ui";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
} from "@heroui/react";
import { useTranslate } from "@tolgee/react";
import { type FC, memo, useCallback, useState, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { useNotificationsStore } from "../../../../shared/ui/store/useNotificationsStore";
import type { NotificationsPanelProps } from "./notifications-panel.types";
import {
	FILTER_OPTIONS,
	type NotificationFilter,
	INITIAL_VISIBLE,
	LOAD_MORE_COUNT,
} from "src/layout/domain/constants/notifications-panel.constants";
import { GetNotifications, MarkNotificationAsRead, MarkAllNotificationsAsRead } from "./DependencyInjection";
import NotificationItem from "./notification-item.component";

const NotificationsPanel: FC<NotificationsPanelProps> = memo(({ className }) => {
	const { t } = useTranslate();
	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
	const [typeFilter, setTypeFilter] = useState<NotificationFilter>("all");
	const [isLoading, setIsLoading] = useState(true);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const {
		notifications,
		isOpen,
		setIsOpen,
		setNotifications: setNotificationsInStore,
		markAsRead,
		markAllAsRead,
	} = useNotificationsStore(
		useShallow((state) => ({
			notifications: state.notifications,
			isOpen: state.isOpen,
			setIsOpen: state.setIsOpen,
			setNotifications: state.setNotifications,
			markAsRead: state.markAsRead,
			markAllAsRead: state.markAllAsRead,
		}))
	);

	// Load notifications from adapter
	useEffect(() => {
		const loadNotifications = async () => {
			setIsLoading(true);
			try {
				const data = await GetNotifications(typeFilter);
				setNotificationsInStore(data);
			} catch (error) {
				console.error("Error loading notifications:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadNotifications();
	}, [typeFilter, setNotificationsInStore]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	// Notifications are already filtered by the adapter, so we use them directly
	const filteredNotifications = notifications;

	// Determine visible count based on filter
	const effectiveVisibleCount = useMemo(() => {
		// Show all notifications for urgent and high filters
		if (typeFilter === "urgent" || typeFilter === "high") {
			return filteredNotifications.length;
		}
		return visibleCount;
	}, [typeFilter, filteredNotifications.length, visibleCount]);

	const hasMore = filteredNotifications.length > effectiveVisibleCount;
	const remainingCount = filteredNotifications.length - effectiveVisibleCount;

	// Reset visible count and filter when popover closes
	useEffect(() => {
		if (!isOpen) {
			setVisibleCount(INITIAL_VISIBLE);
			setTypeFilter("all");
			setIsDropdownOpen(false);
		}
	}, [isOpen]);

	const handleNotificationClick = useCallback(
		(_href: string) => {
			setIsOpen(false);
		},
		[setIsOpen]
	);

	const handleMarkAllAsRead = useCallback(() => {
		markAllAsRead();
		MarkAllNotificationsAsRead();
	}, [markAllAsRead]);

	const handleMarkAsRead = useCallback(
		(id: string) => {
			markAsRead(id);
			MarkNotificationAsRead(id);
		},
		[markAsRead]
	);

	const handleLoadMore = useCallback(() => {
		setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filteredNotifications.length));
	}, [filteredNotifications.length]);

	const getTypeLabel = useCallback(
		(type: NotificationFilter) => {
			switch (type) {
				case "all":
					return t("notifications_filter_all", "Todas");
				case "low":
					return t("notifications_filter_low", "Bajas");
				case "normal":
					return t("notifications_filter_normal", "Normales");
				case "high":
					return t("notifications_filter_high", "Altas");
				case "urgent":
					return t("notifications_filter_urgent", "Urgentes");
			}
		},
		[t]
	);


	const handlePopoverOpenChange = useCallback(
		(open: boolean) => {
			// Don't close popover if dropdown is open
			if (!open && isDropdownOpen) {
				return;
			}
			setIsOpen(open);
		},
		[isDropdownOpen]
	);

	return (
		<Popover
			isOpen={isOpen}
			onOpenChange={handlePopoverOpenChange}
			placement="bottom-end"
			offset={12}
			classNames={{
				content: "p-0 w-[380px] max-w-[calc(100vw-32px)]",
			}}
		>
			<PopoverTrigger>
				<button
					type="button"
					className={`w-10 h-10 cursor-pointer ${className ?? ""}`}
					aria-label={t("notifications_button_aria", "Ver notificaciones")}
				/>
			</PopoverTrigger>
			<PopoverContent>
				<div className="flex flex-col max-h-[480px]">
					{/* Header */}
					<div className="flex items-center justify-between px-4 py-3 border-b border-divider">
						<div className="flex items-center gap-2">
							<P className="font-semibold text-default-900">
								{t("notifications_title", "Notificaciones")}
							</P>
							{unreadCount > 0 && (
								<span className="px-2 py-0.5 text-xs font-medium bg-primary-50/50 text-primary-600 rounded-full">
									{unreadCount} {t("notifications_new", "nuevas")}
								</span>
							)}
						</div>
					<div className="flex items-center gap-2">
						{typeFilter !== "all" && (
							<div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-md text-xs font-medium">
								<span>{getTypeLabel(typeFilter)}</span>
								<button
									type="button"
									onClick={() => {
										setTypeFilter("all");
										setVisibleCount(INITIAL_VISIBLE);
									}}
									className="hover:bg-primary-100 rounded p-0.5 transition-colors"
									aria-label={t("notifications_clear_filter", "Limpiar filtro")}
								>
									<IconComponent
										icon="solar:close-circle-bold"
										className="h-3.5 w-3.5 text-primary-600"
									/>
								</button>
							</div>
						)}
						<Dropdown
							placement="bottom-end"
							isOpen={isDropdownOpen}
							onOpenChange={setIsDropdownOpen}
						>
							<DropdownTrigger>
								<Button
									variant="light"
									size="sm"
									isIconOnly
									aria-label={t("notifications_filter_aria", "Filtrar notificaciones")}
								>
									<IconComponent
										icon="solar:sort-linear"
										className="h-4 w-4 text-default-500"
									/>
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label={t("notifications_filter_menu", "Filtro de tipo")}
								selectedKeys={[typeFilter]}
								selectionMode="single"
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as NotificationFilter;
									setTypeFilter(selected);
									setVisibleCount(INITIAL_VISIBLE);
									setIsDropdownOpen(false);
								}}
							>
								{FILTER_OPTIONS.map((option) => (
									<DropdownItem
										key={option.key}
										startContent={
											<IconComponent
												icon={option.icon}
												className={`h-4 w-4 ${option.color}`}
											/>
										}
									>
										{getTypeLabel(option.key)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
					</div>

					{/* Notifications List - Show max 5 in dropdown */}
					<div className="flex-1 overflow-y-auto max-h-[320px]">
						{filteredNotifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 px-4">
								<IconComponent
									icon="solar:bell-off-line-duotone"
									className="h-12 w-12 text-default-300 mb-3"
								/>
								<P className="text-default-500 text-center">
									{isLoading
										? t("notifications_loading", "Cargando notificaciones...")
										: typeFilter === "all"
											? t("notifications_empty", "No tienes notificaciones")
											: t("notifications_empty_filter", "No hay notificaciones con este filtro")}
								</P>
							</div>
						) : (
							<div className="py-2 px-2">
								{filteredNotifications.slice(0, effectiveVisibleCount).map((notification) => (
									<div key={notification.id}>
										<NotificationItem
											notification={notification}
											onRead={handleMarkAsRead}
											onClick={handleNotificationClick}
										/>
										{notification !== filteredNotifications[filteredNotifications.length - 1] && (
											<div className="border-t border-divider" />
										)}
									</div>
								))}
								{hasMore && (
									<button
										type="button"
										onClick={handleLoadMore}
										className="w-full text-sm text-center text-primary-500 hover:text-primary-600 font-medium py-2 rounded hover:bg-primary-50 transition-colors"
									>
										{t("notifications_view_more", "Ver más")} (+{remainingCount})
									</button>
								)}
							</div>
						)}
					</div>

					{/* Footer - Mark as read button */}
					{notifications.length > 0 && unreadCount > 0 && (
						<div className="flex items-center justify-end px-4 py-2.5 border-t border-divider">
							<button
								type="button"
								onClick={handleMarkAllAsRead}
								className="text-xs text-primary-500 hover:text-primary-600 font-medium px-2 py-1 rounded hover:bg-primary-50 transition-colors"
							>
								{t("notifications_mark_all_read", "Marcar como leídas")}
							</button>
						</div>
					)}

				</div>
			</PopoverContent>
		</Popover>
	);
});

NotificationsPanel.displayName = "NotificationsPanel";

export default NotificationsPanel;
