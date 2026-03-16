import type { ContentCategory } from "../enums/content-category.enum";
import type { ContentGenerationStatus } from "../enums/content-generation-status.enum";
import type { ContentOrigin } from "../enums/content-origin.enum";
import type { ContentType } from "../enums/content-type.enum";

export interface IContentGeneration {
	id: string;
	name: string;
	type: ContentType;
	category: ContentCategory;
	language: string;
	contentType: string;
	variables: Record<string, any>;
	blocks: any[];
	agencyId: string;
	agencyName: string;
	companyId: string;
	companyName: string;
	generatedAssets: IGeneratedAsset[];
	status: ContentGenerationStatus;
	origin?: ContentOrigin;
	errorDetails?: Record<string, any>;
	createdAt: Date;
	updatedAt: Date;
	publishedAt?: Date;
}

export interface IGeneratedAsset {
	type: string;
	url: string;
	metadata?: Record<string, any>;
}

export interface IContentGenerationResponse {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	data: IContentGeneration[];
}
