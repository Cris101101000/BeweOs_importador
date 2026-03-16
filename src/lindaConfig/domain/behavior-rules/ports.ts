import type {
	IBehaviorRule,
	IBehaviorRuleProblem,
	IBehaviorRulesListResponse,
	IGetBehaviorRulesParams,
} from "./interfaces";

/**
 * Puerto del repositorio de reglas de comportamiento
 * Define el contrato para la capa de infraestructura
 */
export interface IBehaviorRuleRepository {
	/**
	 * Obtiene una lista paginada de reglas de comportamiento
	 * @param params - Parámetros de búsqueda y paginación
	 * @returns Lista de reglas y total
	 */
	getBehaviorRules(
		params?: IGetBehaviorRulesParams
	): Promise<IBehaviorRulesListResponse>;

	/**
	 * Crea una nueva regla de comportamiento
	 * @param rule - Datos de la regla a crear
	 * @returns La regla creada con su ID o un problema si no se puede crear
	 */
	createBehaviorRule(
		rule: Omit<
			IBehaviorRule,
			| "id"
			| "createdAt"
			| "updatedAt"
			| "agencyId"
			| "companyId"
			| "priorityLabel"
		>
	): Promise<IBehaviorRule | IBehaviorRuleProblem>;

	/**
	 * Actualiza una regla de comportamiento existente
	 * @param id - ID de la regla a actualizar
	 * @param rule - Datos parciales a actualizar
	 * @returns La regla actualizada o un problema si no se puede actualizar
	 */
	updateBehaviorRule(
		id: string,
		rule: Partial<
			Omit<
				IBehaviorRule,
				| "id"
				| "createdAt"
				| "updatedAt"
				| "agencyId"
				| "companyId"
				| "priorityLabel"
			>
		>
	): Promise<IBehaviorRule | IBehaviorRuleProblem>;

	/**
	 * Elimina una regla de comportamiento
	 * @param id - ID de la regla a eliminar
	 */
	deleteBehaviorRule(id: string): Promise<void>;
}
