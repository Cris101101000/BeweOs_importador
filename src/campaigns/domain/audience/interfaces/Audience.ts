/**
 * Interface para vistas guardadas (Saved Views) del CRM
 */
export interface ISavedView {
	id: string;
	name: string;
	description: string;
	entityType: string;
	filterConfig: ISavedViewFilterConfig;
	userId: string;
	companyId: string;
	isDefault: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Configuración de filtros para vistas guardadas
 */
export interface ISavedViewFilterConfig {
	tags?: string[];
	status?: string[];
	potentialTier?: string[];
	[key: string]: unknown;
}

/**
 * Interface para segmentos de audiencia inteligentes
 */
export interface IAudienceSegment {
	id: string;
	name: string;
	description: string;
	estimatedReach: number;
	expectedVisibility: number;
	criteria: ISegmentCriteria;
}

/**
 * Criterios para segmentación
 */
export interface ISegmentCriteria {
	statuses?: string[];
	tags?: string[];
	excludeTags?: string[];
	creationChannels?: string[];
	dateRange?: {
		from: Date;
		to: Date;
	};
}

/**
 * Filtro para audiencia
 */
export interface IAudienceFilter {
	selectedStatuses: string[];
	selectedTags: string[];
	excludedTags: string[];
	selectedChannels: string[];
	dateRange?: {
		from: Date;
		to: Date;
	};
}

/**
 * Interface para tags de clientes
 */
export interface ITag {
	value: string;
	label: string;
	color: string;
	count: number;
}

/**
 * Interface para status de clientes
 */
export interface IClientStatus {
	value: string;
	label: string;
	color: string;
	count: number;
}
