import type { EnumNewsActionType } from "../enums/enum-news-action-type.enum";

export interface INewsAction {
	type: EnumNewsActionType;
	value: string;
	label: string;
}

export interface INews {
	title: string;
	description: string;
	action: INewsAction;
}
