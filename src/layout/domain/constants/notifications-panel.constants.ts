import { NotificationTypeEnum } from "../enums/notification-panel.enum";


export const INITIAL_VISIBLE = 5;
export const LOAD_MORE_COUNT = 5;

export const NOTIFICATION_TYPE_ICON: Record<NotificationTypeEnum, string> = {
	[NotificationTypeEnum.LOW]: "solar:circle-bottom-down-bold",
	[NotificationTypeEnum.NORMAL]: "solar:circle-bottom-up-bold",
	[NotificationTypeEnum.HIGH]: "solar:danger-triangle-bold",
	[NotificationTypeEnum.URGENT]: "solar:bell-bing-bold",
};

export const NOTIFICATION_TYPE_COLOR: Record<NotificationTypeEnum, string> = {
	[NotificationTypeEnum.LOW]: "text-primary-500",
	[NotificationTypeEnum.NORMAL]: "text-success-500",
	[NotificationTypeEnum.HIGH]: "text-warning-500",
	[NotificationTypeEnum.URGENT]: "text-danger-500",
};

export const NOTIFICATION_TYPE_BG: Record<NotificationTypeEnum, string> = {
	[NotificationTypeEnum.LOW]: "bg-primary-50",
	[NotificationTypeEnum.NORMAL]: "bg-success-50",
	[NotificationTypeEnum.HIGH]: "bg-warning-50",
	[NotificationTypeEnum.URGENT]: "bg-danger-50",
};

export type NotificationFilter = "all" | NotificationTypeEnum;

export const FILTER_OPTIONS: Array<{
	key: NotificationFilter;
	icon: string;
	color: string;
}> = [
	{
		key: "all",
		icon: "solar:list-bold",
		color: "",
	},
	{
		key: NotificationTypeEnum.URGENT,
		icon: NOTIFICATION_TYPE_ICON[NotificationTypeEnum.URGENT],
		color: NOTIFICATION_TYPE_COLOR[NotificationTypeEnum.URGENT],
	},
	{
		key: NotificationTypeEnum.HIGH,
		icon: NOTIFICATION_TYPE_ICON[NotificationTypeEnum.HIGH],
		color: NOTIFICATION_TYPE_COLOR[NotificationTypeEnum.HIGH],
	},
	{
		key: NotificationTypeEnum.NORMAL,
		icon: NOTIFICATION_TYPE_ICON[NotificationTypeEnum.NORMAL],
		color: NOTIFICATION_TYPE_COLOR[NotificationTypeEnum.NORMAL],
	},
	{
		key: NotificationTypeEnum.LOW,
		icon: NOTIFICATION_TYPE_ICON[NotificationTypeEnum.LOW],
		color: NOTIFICATION_TYPE_COLOR[NotificationTypeEnum.LOW],
	},
];