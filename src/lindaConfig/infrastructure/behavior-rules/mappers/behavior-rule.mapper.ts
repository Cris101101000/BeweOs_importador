import type {
	BehaviorRulePriorityLabel,
	IBehaviorRule,
	IBehaviorRuleProblem,
	IBehaviorRulesListResponse,
} from "../../../domain/behavior-rules";
import {
	BehaviorRulePriority,
	BehaviorRuleStatus,
	LABEL_PRIORITY_MAP,
	PRIORITY_LABEL_MAP,
} from "../../../domain/behavior-rules";
import type {
	BehaviorRuleItemDTO,
	BehaviorRuleListDataDTO,
	BehaviorRuleProblemDataDTO,
	CreateBehaviorRuleDTO,
	UpdateBehaviorRuleDTO,
} from "../dtos/behavior-rule.dto";

export class BehaviorRuleMapper {
	private static mapPriorityFromApi(priority: number): BehaviorRulePriority {
		switch (priority) {
			case 1:
				return BehaviorRulePriority.LOW;
			case 2:
				return BehaviorRulePriority.MEDIUM;
			case 3:
				return BehaviorRulePriority.HIGH;
			default:
				return BehaviorRulePriority.MEDIUM;
		}
	}

	private static getPriorityLabel(
		priority: BehaviorRulePriority
	): BehaviorRulePriorityLabel {
		return PRIORITY_LABEL_MAP[priority] || "media";
	}

	private static mapStatusFromApi(status: string): BehaviorRuleStatus {
		switch (status.toLowerCase()) {
			case "active":
				return BehaviorRuleStatus.ACTIVE;
			case "inactive":
				return BehaviorRuleStatus.INACTIVE;
			default:
				return BehaviorRuleStatus.INACTIVE;
		}
	}

	static toDomain(item: BehaviorRuleItemDTO): IBehaviorRule {
		const priority = this.mapPriorityFromApi(item.priority);

		return {
			id: item.id,
			agencyId: item.agencyId,
			companyId: item.companyId,
			name: item.name,
			description: item.description,
			status: this.mapStatusFromApi(item.status),
			priority,
			priorityLabel: this.getPriorityLabel(priority),
			isActive: item.isActive,
			createdAt: new Date(item.createdAt),
			updatedAt: new Date(item.updatedAt),
		};
	}

	static toDomainList(items: BehaviorRuleItemDTO[]): IBehaviorRule[] {
		return items.map((item) => this.toDomain(item));
	}

	static toListResponse(
		data: BehaviorRuleListDataDTO
	): IBehaviorRulesListResponse {
		return {
			items: this.toDomainList(data.items),
			total: data.total,
		};
	}

	static toCreateDTO(
		rule: Omit<
			IBehaviorRule,
			| "id"
			| "createdAt"
			| "updatedAt"
			| "agencyId"
			| "companyId"
			| "priorityLabel"
		>
	): CreateBehaviorRuleDTO {
		return {
			name: rule.name,
			description: rule.description,
			priority: rule.priority,
			isActive: rule.isActive,
			status: rule.status,
		};
	}

	static toUpdateDTO(
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
	): UpdateBehaviorRuleDTO {
		const dto: UpdateBehaviorRuleDTO = {};

		if (rule.name !== undefined) dto.name = rule.name;
		if (rule.description !== undefined) dto.description = rule.description;
		if (rule.priority !== undefined) dto.priority = rule.priority;

		return dto;
	}

	static priorityLabelToNumber(label: BehaviorRulePriorityLabel): number {
		return LABEL_PRIORITY_MAP[label];
	}

	/**
	 * Convierte un DTO de problema de regla (vague o duplicate) al dominio
	 */
	static toProblemDomain(
		data: BehaviorRuleProblemDataDTO
	): IBehaviorRuleProblem {
		// Determinar el tipo de problema basado en la presencia de isDuplicate
		if ("isDuplicate" in data && data.isDuplicate === true) {
			return {
				type: "duplicate",
				problem: data.problem,
				suggestions: data.suggestions,
				duplicateRules: data.duplicateRules,
			};
		}

		// Caso vague (tiene suggestedExamples)
		return {
			type: "vague",
			problem: data.problem,
			suggestions: data.suggestions,
			suggestedExamples: data?.suggestedExamples,
		};
	}
}
