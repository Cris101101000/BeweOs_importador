export interface IScrapedUrl {
	id: string;
	url: string;
	scrapedFrom: string;
	scrapedDomain: string;
	createdAt: Date;
}

export interface ISubUrl {
	id: string;
	url: string;
	title: string;
	description?: string;
	depth: number;
	size: number;
	selected: boolean;
	recommended: boolean;
}

export type UrlSource = "local" | "database";

export type UrlGroupStatus = "pending" | "exploring" | "completed" | "failed";

export interface IUrlGroup {
	id: string;
	url: string;
	subUrls: string[];
	idScrapedUrls?: string[];
	totalSubUrls?: number;
	selectedSubUrls?: number;
	loadedAt: Date;
	source: UrlSource;
	status?: UrlGroupStatus;
}
