import { useAuraToast } from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { useEffect, useState } from "react";
import { ManageBehaviorRulesUseCase } from "../../../../application/behavior-rules/manage-behavior-rules.usecase";
import { ManageFAQsUseCase } from "../../../../application/faq/manage-faqs.usecase";
import { ManageKnowledgeGapsUseCase } from "../../../../application/knowledge-gaps/manage-knowledge-gaps.usecase";
import type {
	IBehaviorRule,
	IBehaviorRulesListResponse,
	IGetBehaviorRulesParams,
} from "../../../../domain/behavior-rules";
import type {
	ICreateFAQInput,
	IFAQFilters,
	IFAQListResponse,
	IUpdateFAQInput,
} from "../../../../domain/faq/interface";
import type { IKnowledgeGap } from "../../../../domain/knowledge-gaps";
import { BehaviorRulesAdapter } from "../../../../infrastructure/behavior-rules";
import { FAQAdapter } from "../../../../infrastructure/faq/adapters/faq.adapter";
import { KnowledgeGapsAdapter } from "../../../../infrastructure/knowledge-gaps/adapters/knowledge-gaps.adapter";

// FAQ
const faqRepository = new FAQAdapter();
const manageFAQsUseCase = new ManageFAQsUseCase(faqRepository);

// Behavior Rules
const behaviorRulesRepository = new BehaviorRulesAdapter();
const manageBehaviorRulesUseCase = new ManageBehaviorRulesUseCase(
	behaviorRulesRepository
);

// Knowledge Gaps
const knowledgeGapsRepository = new KnowledgeGapsAdapter();
const manageKnowledgeGapsUseCase = new ManageKnowledgeGapsUseCase(
	knowledgeGapsRepository
);

export const useFAQs = (chatbotId: string) => {
	const { showToast } = useAuraToast();
	const { t } = useTranslate();

	const [faqs, setFaqs] = useState<IFAQListResponse>({
		items: [],
		pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
		filters: {},
	});
	const [knowledgeGaps, setKnowledgeGaps] = useState<IKnowledgeGap[]>([]);
	const [behaviorRulesResponse, setBehaviorRulesResponse] =
		useState<IBehaviorRulesListResponse>({
			items: [],
			total: 0,
		});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadFAQs = async (filters?: IFAQFilters) => {
		setIsLoading(true);
		setError(null);
		try {
			const faqsData = await manageFAQsUseCase.getFAQs(filters);
			setFaqs(faqsData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error loading FAQ data");
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"faq_load_error",
					"faq_load_error_description"
				)
			);
		} finally {
			setIsLoading(false);
		}
	};

	const loadAll = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [faqsData, gapsData, rulesData] = await Promise.all([
				manageFAQsUseCase.getFAQs(),
				manageKnowledgeGapsUseCase.getAll(chatbotId),
				manageBehaviorRulesUseCase.getBehaviorRules(),
			]);

			setFaqs(faqsData);
			setKnowledgeGaps(gapsData);
			setBehaviorRulesResponse(rulesData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error loading FAQ data");
		} finally {
			setIsLoading(false);
		}
	};

	const loadBehaviorRules = async (params?: IGetBehaviorRulesParams) => {
		setIsLoading(true);
		setError(null);
		try {
			const rulesData =
				await manageBehaviorRulesUseCase.getBehaviorRules(params);
			setBehaviorRulesResponse(rulesData);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error loading behavior rules"
			);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"behavior_rules_load_error",
					"behavior_rules_load_error_description"
				)
			);
		} finally {
			setIsLoading(false);
		}
	};

	const createFAQ = async (faq: ICreateFAQInput) => {
		setIsLoading(true);
		setError(null);
		try {
			const newFAQ = await manageFAQsUseCase.createFAQ(faq);
			setFaqs((prev) => ({
				...prev,
				items: [...prev.items, newFAQ],
				pagination: {
					...prev.pagination,
					total: prev.pagination.total + 1,
				},
			}));
			showToast(
				configureSuccessToast(
					t("faq_create_success", "Pregunta frecuente creada"),
					t(
						"faq_create_success_description",
						"La pregunta frecuente se ha creado correctamente"
					)
				)
			);
			return newFAQ;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error creating FAQ");
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"faq_create_error",
					"faq_create_error_description"
				)
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const updateFAQ = async (id: string, faq: IUpdateFAQInput) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedFAQ = await manageFAQsUseCase.updateFAQ(id, faq);
			setFaqs((prev) => ({
				...prev,
				items: prev.items.map((f) => (f.id === id ? updatedFAQ : f)),
			}));
			showToast(
				configureSuccessToast(
					t("faq_update_success", "Pregunta frecuente actualizada"),
					t(
						"faq_update_success_description",
						"La pregunta frecuente se ha actualizado correctamente"
					)
				)
			);
			return updatedFAQ;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error updating FAQ");
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"faq_update_error",
					"faq_update_error_description"
				)
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteFAQ = async (id: string) => {
		setIsLoading(true);
		setError(null);
		try {
			await manageFAQsUseCase.deleteFAQ(id);
			setFaqs((prev) => ({
				...prev,
				items: prev.items.filter((f) => f.id !== id),
				pagination: {
					...prev.pagination,
					total: prev.pagination.total - 1,
				},
			}));
			showToast(
				configureSuccessToast(
					t("faq_delete_success", "Pregunta frecuente eliminada"),
					t(
						"faq_delete_success_description",
						"La pregunta frecuente se ha eliminado correctamente"
					)
				)
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error deleting FAQ");
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"faq_delete_error",
					"faq_delete_error_description"
				)
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const createBehaviorRule = async (
		rule: Omit<
			IBehaviorRule,
			| "id"
			| "createdAt"
			| "updatedAt"
			| "agencyId"
			| "companyId"
			| "priorityLabel"
		>
	) => {
		setIsLoading(true);
		setError(null);
		try {
			const newRule = await manageBehaviorRulesUseCase.createBehaviorRule(rule);
			setBehaviorRulesResponse((prev) => ({
				...prev,
				items: [...prev.items, newRule],
				total: prev.total + 1,
			}));
			showToast(
				configureSuccessToast(
					t("behavior_rule_create_success", "Regla creada"),
					t(
						"behavior_rule_create_success_description",
						"La regla de comportamiento se ha creado correctamente"
					)
				)
			);
			return newRule;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error creating behavior rule"
			);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"behavior_rule_create_error",
					"behavior_rule_create_error_description"
				)
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const updateBehaviorRule = async (
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
	) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedRule = await manageBehaviorRulesUseCase.updateBehaviorRule(
				id,
				rule
			);
			setBehaviorRulesResponse((prev) => ({
				...prev,
				items: prev.items.map((r) => (r.id === id ? updatedRule : r)),
			}));
			showToast(
				configureSuccessToast(
					t("behavior_rule_update_success", "Regla actualizada"),
					t(
						"behavior_rule_update_success_description",
						"La regla de comportamiento se ha actualizado correctamente"
					)
				)
			);
			return updatedRule;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error updating behavior rule"
			);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"behavior_rule_update_error",
					"behavior_rule_update_error_description"
				)
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteBehaviorRule = async (id: string) => {
		setIsLoading(true);
		setError(null);
		try {
			await manageBehaviorRulesUseCase.deleteBehaviorRule(id);
			setBehaviorRulesResponse((prev) => ({
				...prev,
				items: prev.items.filter((r) => r.id !== id),
				total: prev.total - 1,
			}));
			showToast(
				configureSuccessToast(
					t("behavior_rule_delete_success", "Regla eliminada"),
					t(
						"behavior_rule_delete_success_description",
						"La regla de comportamiento se ha eliminado correctamente"
					)
				)
			);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error deleting behavior rule"
			);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"behavior_rule_delete_error",
					"behavior_rule_delete_error_description"
				)
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteKnowledgeGap = async (id: string) => {
		setIsLoading(true);
		setError(null);
		try {
			await manageKnowledgeGapsUseCase.deleteGap(id);
			setKnowledgeGaps((prev) => prev.filter((g) => g.id !== id));
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error deleting knowledge gap"
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (chatbotId) {
			loadAll();
		}
	}, [chatbotId]);

	return {
		faqs,
		knowledgeGaps,
		behaviorRules: behaviorRulesResponse.items,
		behaviorRulesTotal: behaviorRulesResponse.total,
		isLoading,
		error,
		loadFAQs,
		loadBehaviorRules,
		createFAQ,
		updateFAQ,
		deleteFAQ,
		createBehaviorRule,
		updateBehaviorRule,
		deleteBehaviorRule,
		deleteKnowledgeGap,
		reload: loadAll,
	};
};
