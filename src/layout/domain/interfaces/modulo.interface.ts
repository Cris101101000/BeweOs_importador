import type { INews } from "./news.interface";

export interface IModulo {
	id: string;
	name: string;
	icon: string;
	href?: string;
	type: string;
	order: number;
	labels: ILabel[];
	enabled: boolean;
	resources: string[];
	children?: IModulo[];
}

export interface ILabel {
	id: string;
	title: string;
	color: string;
}

export interface IGroup {
	name: string;
	modules: IModulo[];
}

/**
 * Interface representing a menu, grouping both modules and updates.
 */
export interface IMenu {
	groups: IGroup[];
	news?: INews;
}
