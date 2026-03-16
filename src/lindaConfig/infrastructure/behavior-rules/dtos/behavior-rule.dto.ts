export interface BehaviorRuleItemDTO {
	id: string;
	agencyId: string;
	companyId: string;
	name: string;
	status: string;
	description: string;
	priority: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface BehaviorRuleListDataDTO {
	items: BehaviorRuleItemDTO[];
	total: number;
}

export interface CreateBehaviorRuleDTO {
	name: string;
	description: string;
	priority: number;
	isActive: boolean;
	status: string;
}

export interface UpdateBehaviorRuleDTO {
	name?: string;
	description?: string;
	priority?: number;
}

export interface BehaviorRuleUpdateDataDTO {
	approved: boolean;
	customRule: BehaviorRuleItemDTO;
}

/**
 * DTO para respuesta de problema al crear una regla (caso vague)
 */
export interface BehaviorRuleVagueProblemDTO {
	approved: false;
	problem: string;
	originalRule: string;
	suggestions: string;
	suggestedExamples: string; // JSON string de array de ejemplos
	status: string;
}

/**
 * DTO para respuesta de problema al crear una regla (caso duplicate)
 */
export interface BehaviorRuleDuplicateProblemDTO {
	approved: false;
	problem: string;
	originalRule: string;
	suggestions: string;
	isDuplicate: true;
	duplicateRules: string; // JSON string de array de reglas duplicadas
	status: string;
}

/**
 * DTO unificado para respuesta de problema al crear una regla
 */
export type BehaviorRuleProblemDataDTO =
	| BehaviorRuleVagueProblemDTO
	| BehaviorRuleDuplicateProblemDTO;
