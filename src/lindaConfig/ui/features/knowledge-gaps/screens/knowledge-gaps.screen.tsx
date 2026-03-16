import {
	Accordion,
	AccordionItem,
	Button,
	Card,
	Chip,
	H3,
	H4,
	IconComponent,
	P,
	Spinner,
	Tooltip
} from "@beweco/aurora-ui";
import { ConfirmDeleteModal } from "@shared/ui/components/confirm-delete-modal/confirm-delete-modal";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	GAP_TYPE_CONFIG,
	type IKnowledgeGap,
} from "../../../../domain/knowledge-gaps";
import { useKnowledgeGaps } from "../hooks";

export const KnowledgeGapsScreen: React.FC = () => {
	const navigate = useNavigate();
	const {
		knowledgeGaps,
		isLoading: knowledgeGapsLoading,
		deleteGap,
	} = useKnowledgeGaps("1");

	// Confirmation modal state
	const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
		isOpen: boolean;
		title: string;
		description: string;
		onConfirm: () => void;
	}>({
		isOpen: false,
		title: "",
		description: "",
		onConfirm: () => {},
	});

	//Handled redirect to the corresponding section based on the gap
	// Pass the entire gap data - each destination section will map what it needs
	const handleRedirectToSection = (gap: IKnowledgeGap) => {
		console.log("handleRedirectToSection called with:", { gap });
		const route = GAP_TYPE_CONFIG[gap.type].route;
		console.log("type config:", route);

		// Navigate with the complete gap data - let each section extract what it needs
		navigate(route, {
			state: {
				knowledgeGap: gap,
			},
		});
	};

	return (
		<>
			<div className="space-y-6">
				{/* Header Section */}
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<H3>Lagunas de conocimiento</H3>
						<Tooltip
							content={
								<div className="px-1 py-2 max-w-xs">
									<div className="text-xs font-semibold mb-1">
										¿Qué son las lagunas de conocimiento?
									</div>
									<div className="text-xs">
										Son preguntas frecuentes que los clientes hacen pero que
										Linda aún no puede responder. La IA analiza las
										conversaciones y sugiere respuestas basadas en el contexto
										de tu negocio.
									</div>
								</div>
							}
							placement="right"
						>
							<div className="cursor-help">
								<IconComponent
									icon="solar:info-circle-bold"
									className="text-default-400 hover:text-primary-500 transition-colors"
									size="sm"
								/>
							</div>
						</Tooltip>
					</div>
					<div className="backdrop-blur-xl bg-gradient-to-r from-warning-500/10 to-warning-600/10 border border-warning-200 rounded-full px-4 py-2 shadow-md">
						<div className="flex items-center gap-2">
							<IconComponent
								icon="solar:danger-circle-bold"
								size="sm"
								className="text-warning-600"
							/>
							<span className="text-sm font-semibold text-warning-700">
								{knowledgeGaps.length} pendientes
							</span>
						</div>
					</div>
				</div>

				{/* Knowledge Gaps Accordion */}
				{knowledgeGapsLoading ? (
					<div className="flex items-center justify-center py-12">
						<Spinner size="lg" color="primary" />
					</div>
				) : knowledgeGaps.length === 0 ? (
					<Card className="p-8 text-center">
						<div className="bg-success-100 dark:bg-success-900/20 rounded-full p-4 mb-4 inline-block">
							<IconComponent
								icon="solar:check-circle-bold"
								className="text-success-600 dark:text-success-400"
								size="xl"
							/>
						</div>
						<H4 className="mb-2">¡Excelente!</H4>
						<P className="text-default-500">
							No hay lagunas de conocimiento pendientes. Linda está respondiendo
							todas las preguntas correctamente.
						</P>
					</Card>
				) : (
					<Accordion
						variant="splitted"
						selectionMode="multiple"
						disableIndicatorAnimation
					>
						{knowledgeGaps.map((gap) => {
							const gapTypeConfig = GAP_TYPE_CONFIG[gap.type];

							return (
								<AccordionItem
									key={gap.id}
									aria-label={`Knowledge gap ${gap.id}`}
									classNames={{
										indicator:
											"data-[open=true]:rotate-180 transition-transform duration-200",
									}}
									indicator={
										<IconComponent
											icon="solar:alt-arrow-down-outline"
											size="sm"
											className="text-default-400"
										/>
									}
									title={
										<div className="flex items-center justify-between w-full pr-4">
											<div className="flex items-center gap-3">
												<span className="text-sm text-default-900">
													{gap.question}
												</span>
												{/* Type Banner */}
												<Chip
													size="sm"
													variant="flat"
													color={gapTypeConfig.color}
													startContent={
														<IconComponent
															icon={gapTypeConfig.icon}
															size="sm"
														/>
													}
												>
													{gapTypeConfig.label}
												</Chip>
											</div>
											<div className="flex items-center gap-1">
												{/* Delete Button */}
												<div onClick={(e) => e.stopPropagation()}>
													<Button
														variant="light"
														size="sm"
														color="danger"
														isIconOnly
														onPress={() => {
															setConfirmDeleteModal({
																isOpen: true,
																title: "Rechazar laguna",
																description: `¿Estás seguro de que deseas rechazar esta laguna de conocimiento?\n\nPregunta: "${gap.question}"\n\nEsta acción no se puede deshacer.`,
																onConfirm: async () => {
																	await deleteGap(gap.id);
																	setConfirmDeleteModal((prev) => ({
																		...prev,
																		isOpen: false,
																	}));
																},
															});
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
											<strong>Respuesta sugerida por IA:</strong>
										</P>
										<P className="text-sm text-default-600 leading-relaxed mb-4">
											{gap.suggestedAnswer || "Sin respuesta sugerida"}
										</P>

										<div className="mt-4 pt-4 border-t border-default-200 flex items-center justify-between">
											<P className="text-xs text-default-500">
												Detectado: {gap.createdAt.toLocaleDateString("es-ES")}
											</P>
											<Button
												size="sm"
												color="primary"
												variant="solid"
												className="font-semibold shadow-lg"
												onPress={() => {
													// Navegar a la sección correspondiente según el tipo de laguna
													handleRedirectToSection(gap);
												}}
												startContent={
													<IconComponent
														icon="solar:check-circle-bold"
														size="sm"
													/>
												}
											>
												{gapTypeConfig.buttonLabel}
											</Button>
										</div>
									</div>
								</AccordionItem>
							);
						})}
					</Accordion>
				)}
			</div>

			{/* Confirm Delete Modal */}
			<ConfirmDeleteModal
				isOpen={confirmDeleteModal.isOpen}
				onClose={() =>
					setConfirmDeleteModal({ ...confirmDeleteModal, isOpen: false })
				}
				onConfirm={confirmDeleteModal.onConfirm}
				title={confirmDeleteModal.title}
				description={confirmDeleteModal.description}
			/>
		</>
	);
};
