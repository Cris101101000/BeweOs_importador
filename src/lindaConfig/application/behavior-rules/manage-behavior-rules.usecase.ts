import type {
	IBehaviorRule,
	IBehaviorRuleProblem,
	IBehaviorRuleRepository,
	IBehaviorRulesListResponse,
	IGetBehaviorRulesParams,
} from "../../domain/behavior-rules";

export class ManageBehaviorRulesUseCase {
	constructor(
		private readonly behaviorRuleRepository: IBehaviorRuleRepository
	) {}

	async getBehaviorRules(
		params?: IGetBehaviorRulesParams
	): Promise<IBehaviorRulesListResponse> {
		return await this.behaviorRuleRepository.getBehaviorRules(params);
	}

	async createBehaviorRule(
		rule: Omit<
			IBehaviorRule,
			| "id"
			| "createdAt"
			| "updatedAt"
			| "agencyId"
			| "companyId"
			| "priorityLabel"
		>
	): Promise<IBehaviorRule | IBehaviorRuleProblem> {
		return await this.behaviorRuleRepository.createBehaviorRule(rule);
	}

	async updateBehaviorRule(
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
	): Promise<IBehaviorRule | IBehaviorRuleProblem> {
		return await this.behaviorRuleRepository.updateBehaviorRule(id, rule);
	}

	async deleteBehaviorRule(id: string): Promise<void> {
		return await this.behaviorRuleRepository.deleteBehaviorRule(id);
	}
}

