import type { BehaviorRulePriority, BehaviorRuleStatus } from "./enums";

/**
 * Labels de prioridad para mostrar en la UI
 */
export type BehaviorRulePriorityLabel = "baja" | "media" | "alta";

/**
 * Entidad de dominio: Regla de Comportamiento
 */
export interface IBehaviorRule {
	id: string;
	agencyId: string;
	companyId: string;
	name: string;
	description: string;
	status: BehaviorRuleStatus;
	priority: BehaviorRulePriority;
	priorityLabel: BehaviorRulePriorityLabel;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Parámetros para obtener reglas de comportamiento
 */
export interface IGetBehaviorRulesParams {
	search?: string;
	limit?: number;
	offset?: number;
}

/**
 * Respuesta paginada de reglas de comportamiento
 */
export interface IBehaviorRulesListResponse {
	items: IBehaviorRule[];
	total: number;
}

/**
 * Respuesta de problema al crear una regla de comportamiento
 */
export interface IBehaviorRuleProblem {
	type: "duplicate" | "vague";
	problem: string;
	suggestions: string;
	duplicateRules?: string; // JSON string de array de reglas duplicadas
	suggestedExamples?: string; // JSON string de array de ejemplos sugeridos
}
