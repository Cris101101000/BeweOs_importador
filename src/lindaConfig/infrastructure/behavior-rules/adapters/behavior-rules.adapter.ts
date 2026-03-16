import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import type {
	IBehaviorRule,
	IBehaviorRuleProblem,
	IBehaviorRuleRepository,
	IBehaviorRulesListResponse,
	IGetBehaviorRulesParams,
} from "../../../domain/behavior-rules";
import type {
	BehaviorRuleListDataDTO,
	BehaviorRuleProblemDataDTO,
	BehaviorRuleUpdateDataDTO,
} from "../dtos/behavior-rule.dto";
import { BehaviorRuleMapper } from "../mappers/behavior-rule.mapper";

export class BehaviorRulesAdapter implements IBehaviorRuleRepository {
	private readonly httpClient: IHttpClient = httpService;

	async getBehaviorRules(
		params?: IGetBehaviorRulesParams
	): Promise<IBehaviorRulesListResponse> {
		const queryParams = new URLSearchParams();

		if (params?.search) {
			queryParams.append("search", params.search);
		}
		if (params?.limit !== undefined) {
			queryParams.append("limit", params.limit.toString());
		}
		if (params?.offset !== undefined) {
			queryParams.append("offset", params.offset.toString());
		}

		const queryString = queryParams.toString();
		const url = queryString
			? `/linda/config/custom-rules?${queryString}`
			: "/linda/config/custom-rules";

		const response = await this.httpClient.get<BehaviorRuleListDataDTO>(url);

		if (response.success && response.data) {
			return BehaviorRuleMapper.toListResponse(response.data);
		}

		throw new Error(response.error?.code || "Failed to get behavior rules");
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
		const dto = BehaviorRuleMapper.toCreateDTO(rule);

		const response = await this.httpClient.post<
			BehaviorRuleUpdateDataDTO | BehaviorRuleProblemDataDTO
		>("/linda/config/custom-rules", dto, {
			timeout: 180000,
		});
	

		if (!response.success || !response.data) {
			throw new Error(
				response.error?.code || "Failed to create behavior rule"
			);
		}
		if (response.success && response.data?.approved === true) {
			const updateData = response.data as BehaviorRuleUpdateDataDTO;
			if (updateData.customRule) {
				return BehaviorRuleMapper.toDomain(updateData.customRule);
			}
			throw new Error("Failed to create behavior rule: missing customRule");
		}
		if (response.success && response.data?.approved === false) {
			const problemData = response.data as BehaviorRuleProblemDataDTO;
			return BehaviorRuleMapper.toProblemDomain(problemData);
		}
		throw new Error(response.error?.code || "Failed to create behavior rule");
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
		const dto = BehaviorRuleMapper.toUpdateDTO(rule);

		const response = await this.httpClient.put<
			BehaviorRuleUpdateDataDTO | BehaviorRuleProblemDataDTO
		>(
			`/linda/config/custom-rules/${id}`,
			dto, 
			{
				timeout: 180000,
			}
		);

		if (!response.success || !response.data) {
			throw new Error(
				response.error?.code || "Failed to update behavior rule"
			);
		}
		if (response.success && response.data?.approved === true) {
			const updateData = response.data as BehaviorRuleUpdateDataDTO;
			if (updateData.customRule) {
				return BehaviorRuleMapper.toDomain(updateData.customRule);
			}
			throw new Error("Failed to update behavior rule: missing customRule");
		}
		if (response.success && response.data?.approved === false) {
			const problemData = response.data as BehaviorRuleProblemDataDTO;
			return BehaviorRuleMapper.toProblemDomain(problemData);
		}
		throw new Error(response.error?.code || "Failed to update behavior rule");
	}

	async deleteBehaviorRule(id: string): Promise<void> {
		const response = await this.httpClient.delete<void>(
			`/linda/config/custom-rules/${id}`
		);

		if (!response.success) {
			throw new Error(response.error?.code || "Failed to delete behavior rule");
		}
	}
}

export { BehaviorRulesAdapter as BehaviorRuleRepositoryAdapter };
