import {
	Accordion,
	AccordionItem,
	Button,
	Card,
	Chip,
	H3,
	H4,
	IconComponent,
	Input,
	P,
	Spinner,
} from "@beweco/aurora-ui";
import { useAuraToast } from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { ManageBehaviorRulesUseCase } from "../../../../application/behavior-rules/manage-behavior-rules.usecase";
import type {
	BehaviorRulePriorityLabel,
	IBehaviorRule,
	IBehaviorRuleProblem,
	IGetBehaviorRulesParams,
} from "../../../../domain/behavior-rules";
import { BehaviorRuleStatus } from "../../../../domain/behavior-rules";
import {
	BehaviorRuleMapper,
	BehaviorRulesAdapter,
} from "../../../../infrastructure/behavior-rules";
import {
	CreateRuleModal,
	DeleteRuleModal,
	EditRuleModal,
	ProblemRuleModal,
} from "../components";

// Inicializar adapter y use case
const behaviorRulesAdapter = new BehaviorRulesAdapter();
const manageBehaviorRulesUseCase = new ManageBehaviorRulesUseCase(
	behaviorRulesAdapter
);

export const BehaviorRulesScreen: React.FC = () => {
	const { showToast } = useAuraToast();
	const { t } = useTranslate();

	// Behavior Rules states
	const [rulesSearchQuery, setRulesSearchQuery] = useState("");
	const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
	const [showEditRuleModal, setShowEditRuleModal] = useState(false);
	const [showDeleteRuleModal, setShowDeleteRuleModal] = useState(false);
	const [showProblemRuleModal, setShowProblemRuleModal] = useState(false);
	const [selectedRule, setSelectedRule] = useState<IBehaviorRule | null>(null);
	const [ruleToDelete, setRuleToDelete] = useState<IBehaviorRule | null>(null);
	const [ruleProblem, setRuleProblem] = useState<IBehaviorRuleProblem | null>(
		null
	);
	const [createRuleInitialValues, setCreateRuleInitialValues] = useState<{
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive: boolean;
	} | null>(null);
	const [editRuleInitialValues, setEditRuleInitialValues] = useState<{
		id: string;
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive: boolean;
	} | null>(null);

	// Data states
	const [behaviorRules, setBehaviorRules] = useState<IBehaviorRule[]>([]);
	const [totalRules, setTotalRules] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isCreatingRule, setIsCreatingRule] = useState(false);
	const [isUpdatingRule, setIsUpdatingRule] = useState(false);

	// Load behavior rules
	const loadBehaviorRules = useCallback(
		async (params?: IGetBehaviorRulesParams) => {
			setIsLoading(true);
			setError(null);
			try {
				const response =
					await manageBehaviorRulesUseCase.getBehaviorRules(params);
				setBehaviorRules(response.items);
				setTotalRules(response.total);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error loading behavior rules";
				setError(errorMessage);
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
		},
		[showToast, t]
	);

	// Initial load
	useEffect(() => {
		loadBehaviorRules();
	}, [loadBehaviorRules]);

	// Handle search with debounce
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			loadBehaviorRules({ search: rulesSearchQuery || undefined });
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [rulesSearchQuery, loadBehaviorRules]);

	// Filter behavior rules based on search query (client-side for immediate feedback)
	const filteredRules = behaviorRules.filter(
		(rule) =>
			rule.name.toLowerCase().includes(rulesSearchQuery.toLowerCase()) ||
			rule.description.toLowerCase().includes(rulesSearchQuery.toLowerCase())
	);

	// Behavior rules handling functions
	const handleEditRule = (rule: IBehaviorRule) => {
		setSelectedRule(rule);
		setShowEditRuleModal(true);
	};

	const handleDeleteRule = async (ruleId: string) => {
		const rule = behaviorRules.find((r) => r.id === ruleId);
		if (rule) {
			setRuleToDelete(rule);
			setShowDeleteRuleModal(true);
		}
	};

	const handleConfirmDeleteRule = async (ruleId: string) => {
		try {
			await manageBehaviorRulesUseCase.deleteBehaviorRule(ruleId);
			setBehaviorRules((prev) => prev.filter((r) => r.id !== ruleId));
			setTotalRules((prev) => prev - 1);
			showToast(
				configureSuccessToast(
					t("behavior_rule_delete_success", "Regla eliminada"),
					t(
						"behavior_rule_delete_success_description",
						"La regla de comportamiento se ha eliminado correctamente"
					)
				)
			);
			setShowDeleteRuleModal(false);
			setRuleToDelete(null);
		} catch (err) {
			console.error("Error deleting rule:", err);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"behavior_rule_delete_error",
					"behavior_rule_delete_error_description"
				)
			);
		}
	};

	const handleCreateRule = async (ruleData: {
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive: boolean;
	}) => {
		setIsCreatingRule(true);
		try {
			// Convert priority label to enum
			const priorityValue = BehaviorRuleMapper.priorityLabelToNumber(
				ruleData.priority
			);

			const result = await manageBehaviorRulesUseCase.createBehaviorRule({
				name: ruleData.name,
				description: ruleData.description,
				priority: priorityValue,
				isActive: ruleData.isActive,
				status: ruleData.isActive
					? BehaviorRuleStatus.ACTIVE
					: BehaviorRuleStatus.INACTIVE,
			});

			// Check if result is a problem (has 'type' property)
			if ("type" in result) {
				// It's a problem response
				const problem = result as IBehaviorRuleProblem;
				setRuleProblem(problem);
				setCreateRuleInitialValues(ruleData);

				// Show warning toast
				showToast({
					color: "warning",
					title: t(
						"behavior_rule_create_warning",
						"Problema al crear la regla"
					),
					description: problem.problem,
				});

				// Open problem modal
				setShowProblemRuleModal(true);
				setIsCreatingRule(false);
				return;
			}

			// Success: it's a valid rule
			const newRule = result as IBehaviorRule;
			setBehaviorRules((prev) => [...prev, newRule]);
			setTotalRules((prev) => prev + 1);
			showToast(
				configureSuccessToast(
					t("behavior_rule_create_success", "Regla creada"),
					t(
						"behavior_rule_create_success_description",
						"La regla de comportamiento se ha creado correctamente"
					)
				)
			);
			// Clear initial values and close modal on success
			setCreateRuleInitialValues(null);
			setShowCreateRuleModal(false);
		} catch (err) {
			console.error("Error creating rule:", err);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"behavior_rule_create_error",
					"behavior_rule_create_error_description"
				)
			);
		} finally {
			setIsCreatingRule(false);
		}
	};

	const handleEditFromProblem = () => {
		const problemType = ruleProblem?.type;

		setShowProblemRuleModal(false);
		setRuleProblem(null);

		// Handle create rule case
		if (
			createRuleInitialValues &&
			problemType === "vague" &&
			ruleProblem?.suggestedExamples
		) {
			try {
				const examples = JSON.parse(ruleProblem.suggestedExamples);
				const updatedValues = {
					...createRuleInitialValues,
					description: examples[0] || createRuleInitialValues.description,
				};
				setCreateRuleInitialValues(updatedValues);
				// Open create modal with updated values
				setShowCreateRuleModal(true);
			} catch {
				// If parsing fails, keep original values
				setShowCreateRuleModal(true);
			}
		}

		// Handle edit rule case
		if (
			editRuleInitialValues &&
			problemType === "vague" &&
			ruleProblem?.suggestedExamples
		) {
			try {
				const examples = JSON.parse(ruleProblem.suggestedExamples);
				const updatedValues = {
					...editRuleInitialValues,
					description: examples[0] || editRuleInitialValues.description,
				};
				setEditRuleInitialValues(updatedValues);
				// Open edit modal with updated values (including suggested description)
				if (selectedRule) {
					setShowEditRuleModal(true);
				}
			} catch {
				// If parsing fails, keep original values
				if (selectedRule) {
					setShowEditRuleModal(true);
				}
			}
		}
	};

	const handleCloseProblemModal = () => {
		setShowProblemRuleModal(false);
		setRuleProblem(null);

		// If we have create initial values, reopen create modal
		if (createRuleInitialValues && !showCreateRuleModal) {
			setShowCreateRuleModal(true);
		}
		// If we have edit initial values, reopen edit modal
		if (editRuleInitialValues && !showEditRuleModal && selectedRule) {
			setShowEditRuleModal(true);
		}
	};

	const handleUpdateRule = async (ruleData: {
		id: string;
		name: string;
		description: string;
		priority: BehaviorRulePriorityLabel;
		isActive: boolean;
	}) => {
		if (!selectedRule) return;

		setIsUpdatingRule(true);
		try {
			// Convert priority label to enum
			const priorityValue = BehaviorRuleMapper.priorityLabelToNumber(
				ruleData.priority
			);

			// Solo enviar los campos editables: name, description, priority
			const result = await manageBehaviorRulesUseCase.updateBehaviorRule(
				selectedRule.id,
				{
					name: ruleData.name,
					description: ruleData.description,
					priority: priorityValue,
				}
			);

			// Check if result is a problem (has 'type' property)
			if ("type" in result) {
				// It's a problem response
				const problem = result as IBehaviorRuleProblem;
				setRuleProblem(problem);
				setEditRuleInitialValues(ruleData);

				// Show warning toast
				showToast({
					color: "warning",
					title: t(
						"behavior_rule_update_warning",
						"Problema al actualizar la regla"
					),
					description: problem.problem,
				});

				// Open problem modal
				setShowProblemRuleModal(true);
				setIsUpdatingRule(false);
				return;
			}

			// Success: it's a valid rule
			const updatedRule = result as IBehaviorRule;
			setBehaviorRules((prev) =>
				prev.map((r) => (r.id === selectedRule.id ? updatedRule : r))
			);
			showToast(
				configureSuccessToast(
					t("behavior_rule_update_success", "Regla actualizada"),
					t(
						"behavior_rule_update_success_description",
						"La regla de comportamiento se ha actualizado correctamente"
					)
				)
			);
			setShowEditRuleModal(false);
			setSelectedRule(null);
			setEditRuleInitialValues(null);
		} catch (err) {
			console.error("Error updating rule:", err);
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Unexpected,
					t,
					"behavior_rule_update_error",
					"behavior_rule_update_error_description"
				)
			);
		} finally {
			setIsUpdatingRule(false);
		}
	};

	// Get priority color for chip
	const getPriorityColor = (priorityLabel: string) => {
		switch (priorityLabel) {
			case "alta":
				return "danger";
			case "media":
				return "warning";
			case "baja":
			default:
				return "default";
		}
	};

	// Format priority label for display
	const formatPriorityLabel = (priorityLabel: string) => {
		return priorityLabel.charAt(0).toUpperCase() + priorityLabel.slice(1);
	};

	return (
		<>
			<div className="space-y-6">
				{/* Header Section */}
				<div className="mb-6">
					<H3 className="mb-4">Normas de comportamiento</H3>
					{/* Search and Actions Section */}
					<div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px] justify-between">
						{/* Left section: Search */}
						<div className="flex items-center gap-3">
							<Input
								className="flex-1 max-w-xs min-w-52"
								placeholder="Buscar"
								value={rulesSearchQuery}
								onChange={(e) => setRulesSearchQuery(e.target.value)}
								startContent={
									<IconComponent
										icon="solar:magnifer-outline"
										size="sm"
										className="text-default-400"
									/>
								}
								isClearable
								onClear={() => setRulesSearchQuery("")}
							/>
						</div>

						{/* Right section: Button */}
						<div className="flex items-center gap-4">
							<Button
								color="primary"
								size="sm"
								onPress={() => setShowCreateRuleModal(true)}
								startContent={
									<IconComponent icon="solar:add-circle-bold" size="sm" />
								}
							>
								Nueva norma de comportamiento
							</Button>
						</div>
					</div>
				</div>

				{/* Results Counter */}
				<div className="flex justify-between items-center mb-4">
					<P className="text-sm text-default-500">
						{isLoading ? (
							"Cargando..."
						) : (
							<>
								{filteredRules.length} norma
								{filteredRules.length !== 1 ? "s" : ""} encontrada
								{filteredRules.length !== 1 ? "s" : ""}
								{totalRules > 0 && ` de ${totalRules} total`}
							</>
						)}
					</P>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="flex items-center justify-center py-12">
						<Spinner size="lg" color="primary" />
					</div>
				)}

				{/* Error State */}
				{error && !isLoading && (
					<Card className="p-8 text-center">
						<IconComponent
							icon="solar:danger-triangle-outline"
							size="lg"
							className="text-danger-300 mx-auto mb-3"
						/>
						<H4 className="mb-2">Error al cargar las reglas</H4>
						<P className="text-default-500 mb-4">{error}</P>
						<Button
							color="primary"
							variant="flat"
							size="sm"
							onPress={() => loadBehaviorRules()}
						>
							Reintentar
						</Button>
					</Card>
				)}

				{/* Rules Accordion with Selection */}
				{!isLoading && !error && filteredRules.length > 0 && (
					<Accordion
						variant="splitted"
						selectionMode="multiple"
						disableIndicatorAnimation
					>
						{filteredRules.map((rule) => (
							<AccordionItem
								key={rule.id}
								aria-label={`Rule ${rule.id}`}
								indicator={
									<IconComponent
										icon="solar:alt-arrow-down-outline"
										size="sm"
										className="text-default-400 transition-transform duration-200 data-[open=true]:rotate-180"
									/>
								}
								classNames={{
									indicator:
										"data-[open=true]:rotate-180 transition-transform duration-200",
								}}
								title={
									<div className="flex items-center justify-between w-full pr-4">
										<div className="flex items-center gap-3">
											<span className="text-sm text-default-900">
												{rule.name}
											</span>
											{/* Priority Chip */}
											<Chip
												size="sm"
												variant="flat"
												color={getPriorityColor(rule.priorityLabel)}
												className="text-xs"
											>
												Prioridad {formatPriorityLabel(rule.priorityLabel)}
											</Chip>
										</div>
										<div className="flex items-center gap-1">
											<div onClick={(e) => e.stopPropagation()}>
												<Button
													variant="light"
													color="default"
													size="sm"
													isIconOnly
													onPress={() => {
														handleEditRule(rule);
													}}
													startContent={
														<IconComponent
															icon="solar:pen-outline"
															size="sm"
															className="text-default-400"
														/>
													}
												/>
											</div>
											<div onClick={(e) => e.stopPropagation()}>
												<Button
													variant="light"
													size="sm"
													color="danger"
													isIconOnly
													onPress={() => {
														handleDeleteRule(rule.id);
													}}
													startContent={
														<IconComponent
															icon="solar:trash-bin-minimalistic-outline"
															size="sm"
														/>
													}
												/>
											</div>
										</div>
									</div>
								}
							>
								<div className="pb-4">
									<P className="text-sm text-default-600 mb-3">
										<strong>Descripción:</strong>
									</P>
									<P className="text-sm text-default-600 leading-relaxed">
										{rule.description}
									</P>
									<div className="mt-3 pt-3 border-t border-default-200">
										<P className="text-xs text-default-500">
											Última actualización:{" "}
											{rule.updatedAt.toLocaleDateString("es-ES")}
										</P>
									</div>
								</div>
							</AccordionItem>
						))}
					</Accordion>
				)}

				{/* Empty State */}
				{!isLoading && !error && filteredRules.length === 0 && (
					<Card className="p-8 text-center">
						<IconComponent
							icon="solar:shield-check-outline"
							size="lg"
							className="text-default-300 mx-auto mb-3"
						/>
						<H4 className="mb-2">No se encontraron normas</H4>
						<P className="text-default-500 mb-4">
							{rulesSearchQuery
								? "Intenta con otros términos de búsqueda"
								: "Comienza agregando tu primera norma de comportamiento"}
						</P>
						{!rulesSearchQuery && (
							<Button
								color="primary"
								variant="flat"
								size="sm"
								onPress={() => setShowCreateRuleModal(true)}
								startContent={
									<IconComponent icon="solar:add-circle-bold" size="sm" />
								}
							>
								Crear primera norma
							</Button>
						)}
					</Card>
				)}
			</div>

			{/* Behavior Rules Modals */}
			<CreateRuleModal
				isOpen={showCreateRuleModal}
				onClose={() => {
					setShowCreateRuleModal(false);
					setCreateRuleInitialValues(null);
				}}
				onSave={handleCreateRule}
				initialValues={createRuleInitialValues || undefined}
				isLoading={isCreatingRule}
			/>

			{ruleProblem && (
				<ProblemRuleModal
					isOpen={showProblemRuleModal}
					onClose={handleCloseProblemModal}
					onEdit={handleEditFromProblem}
					problem={ruleProblem}
				/>
			)}

			<EditRuleModal
				isOpen={showEditRuleModal}
				onClose={() => {
					setShowEditRuleModal(false);
					setSelectedRule(null);
					setEditRuleInitialValues(null);
				}}
				onSave={handleUpdateRule}
				rule={
					selectedRule
						? {
								id: selectedRule.id,
								name: selectedRule.name,
								description: selectedRule.description,
								priority: selectedRule.priorityLabel,
								isActive: selectedRule.isActive,
							}
						: null
				}
				isLoading={isUpdatingRule}
				initialValues={editRuleInitialValues || undefined}
			/>

			<DeleteRuleModal
				isOpen={showDeleteRuleModal}
				onClose={() => {
					setShowDeleteRuleModal(false);
					setRuleToDelete(null);
				}}
				onConfirm={handleConfirmDeleteRule}
				rule={ruleToDelete}
			/>
		</>
	);
};
