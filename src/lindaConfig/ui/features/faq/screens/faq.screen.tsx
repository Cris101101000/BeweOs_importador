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
import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
	IFAQ,
	IFAQFromKnowledgeGap,
} from "../../../../domain/faq/interface";
import type { IKnowledgeGap } from "../../../../domain/knowledge-gaps";
import { FAQMapper } from "../../../../infrastructure/faq/mappers/faq.mapper";
import { CreateFAQModal, DeleteFAQModal, EditFAQModal } from "../components";
import { useFAQs } from "../hooks";

// Interface for the navigation state from knowledge gaps
interface KnowledgeGapNavigationState {
	knowledgeGap?: IKnowledgeGap;
}

export const FAQScreen: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const {
		faqs,
		createFAQ,
		updateFAQ,
		deleteFAQ,
		isLoading: faqLoading,
	} = useFAQs("1"); // Mock chatbot ID

	// FAQ states
	const [faqSearchQuery, setFaqSearchQuery] = useState("");
	const [showCreateFAQModal, setShowCreateFAQModal] = useState(false);
	const [showEditFAQModal, setShowEditFAQModal] = useState(false);
	const [selectedFAQ, setSelectedFAQ] = useState<any>(null);
	const [showDeleteFAQModal, setShowDeleteFAQModal] = useState(false);
	const [faqToDelete, setFaqToDelete] = useState<any>(null);

	// State for pre-filled FAQ data from knowledge gaps
	const [initialFAQData, setInitialFAQData] =
		useState<IFAQFromKnowledgeGap | null>(null);

	// Handle navigation state from knowledge gaps to auto-open modal with pre-filled data
	useEffect(() => {
		const state = location.state as KnowledgeGapNavigationState | null;

		if (state?.knowledgeGap) {
			const faqData = FAQMapper.fromKnowledgeGap(state.knowledgeGap);

			setInitialFAQData(faqData);
			setShowCreateFAQModal(true);
			navigate(location.pathname + location.search, {
				replace: true,
				state: null,
			});
		}
	}, [location.state, navigate, location.pathname, location.search]);

	// Filter FAQs based on search query
	const filteredFAQs = faqs?.items?.filter(
		(faq: IFAQ) =>
			faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
	);

	// FAQ handling functions
	const handleEditFAQ = (_question: string, id: string) => {
		const faq = faqs.items.find((f) => f.id === id);
		if (faq) {
			setSelectedFAQ(faq);
			setShowEditFAQModal(true);
		}
	};

	const handleDeleteFAQ = (_question: string, id: string) => {
		const faq = faqs.items.find((f) => f.id === id);
		if (faq) {
			setFaqToDelete(faq);
			setShowDeleteFAQModal(true);
		}
	};

	return (
		<>
			<div className="space-y-6">
				{/* Header Section */}
				<div className="mb-6 flex items-center justify-between">
					<H3>Preguntas frecuentes</H3>
				</div>

				{/* Search and Actions Section */}
				<div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px] justify-between">
					{/* Left section: Search */}
					<div className="flex items-center gap-3">
						<Input
							className="flex-1 max-w-xs min-w-52"
							placeholder="Buscar"
							value={faqSearchQuery}
							onChange={(e) => setFaqSearchQuery(e.target.value)}
							startContent={
								<IconComponent
									icon="solar:magnifer-outline"
									size="sm"
									className="text-default-400"
								/>
							}
							isClearable
							onClear={() => setFaqSearchQuery("")}
						/>
					</div>

					{/* Right section: Button */}
					<div className="flex items-center gap-4">
						<Button
							color="primary"
							size="sm"
							onPress={() => setShowCreateFAQModal(true)}
							startContent={
								<IconComponent icon="solar:add-circle-bold" size="sm" />
							}
						>
							Nueva pregunta frecuente
						</Button>
					</div>
				</div>

				{/* Results Counter */}
				<div className="flex justify-between items-center mb-4">
					<P className="text-sm text-default-500">
						{filteredFAQs.length} pregunta{filteredFAQs.length !== 1 ? "s" : ""}{" "}
						encontrada{filteredFAQs.length !== 1 ? "s" : ""}
					</P>
				</div>
				
				{/* FAQs Accordion with Selection */}
				{faqLoading ? (
					<div className="flex items-center justify-center py-12">
						<Spinner size="lg" color="primary" />
					</div>
				) : filteredFAQs.length > 0 ? (
					<Accordion
						variant="splitted"
						selectionMode="multiple"
						disableIndicatorAnimation
					>
						{filteredFAQs.map((faq) => (
							<AccordionItem
								key={faq.id}
								aria-label={`FAQ ${faq.id}`}
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
												{faq.question}
											</span>
											{/* Active Status */}
											<Chip
												size="sm"
												variant="flat"
												color={faq.isActive ? "success" : "warning"}
												className="text-xs"
											>
												{faq.isActive ? "Activa" : "Inactiva"}
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
														console.log("Edit button clicked!");
														handleEditFAQ(faq.question, faq.id);
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
														console.log("Delete button clicked!");
														handleDeleteFAQ(faq.question, faq.id);
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
										<strong>Respuesta:</strong>
									</P>
									<P className="text-sm text-default-600 leading-relaxed">
										{faq.answer}
									</P>
									<div className="mt-3 pt-3 border-t border-default-200">
										<P className="text-xs text-default-500">
											Última actualización:{" "}
											{faq.updatedAt.toLocaleDateString("es-ES")}
										</P>
									</div>
								</div>
							</AccordionItem>
						))}
					</Accordion>
				) : (
					<Card className="p-8 text-center">
						<IconComponent
							icon="solar:question-circle-outline"
							size="lg"
							className="text-default-300 mx-auto mb-3"
						/>
						<H4 className="mb-2">No se encontraron preguntas</H4>
						<P className="text-default-500 mb-4">
							{faqSearchQuery
								? "Intenta con otros términos de búsqueda"
								: "Comienza agregando tu primera pregunta frecuente"}
						</P>
						{!faqSearchQuery && (
							<Button
								color="primary"
								variant="flat"
								size="sm"
								onPress={() => setShowCreateFAQModal(true)}
								startContent={
									<IconComponent icon="solar:add-circle-bold" size="sm" />
								}
							>
								Crear primera pregunta
							</Button>
						)}
					</Card>
				)}
			</div>

			{/* FAQ Modals */}
			<CreateFAQModal
				isOpen={showCreateFAQModal}
				onClose={() => {
					setShowCreateFAQModal(false);
					setInitialFAQData(null);
				}}
				onSave={async (faq) => {
					try {
						await createFAQ({
							question: faq.question,
							answer: faq.answer,
						});
						// Close modal and clear initial data after successful creation
						setShowCreateFAQModal(false);
						setInitialFAQData(null);
					} catch (error) {
						// Error is already handled by the hook with toast
						console.error("Error creating FAQ:", error);
					}
				}}
				initialData={
					initialFAQData
						? {
								question: initialFAQData.question,
								answer: initialFAQData.answer,
							}
						: null
				}
			/>

			<EditFAQModal
				isOpen={showEditFAQModal}
				onClose={() => {
					setShowEditFAQModal(false);
					setSelectedFAQ(null);
				}}
				onSave={async (faq: {
					id: string;
					question: string;
					answer: string;
					isActive: boolean;
				}) => {
					try {
						await updateFAQ(faq.id, {
							question: faq.question,
							answer: faq.answer,
							isActive: faq.isActive,
						});
						setShowEditFAQModal(false);
						setSelectedFAQ(null);
					} catch (error) {
						console.error("Error updating FAQ:", error);
					}
				}}
				faq={selectedFAQ}
			/>

			<DeleteFAQModal
				isOpen={showDeleteFAQModal}
				onClose={() => {
					setShowDeleteFAQModal(false);
					setFaqToDelete(null);
				}}
				onConfirm={async () => {
					if (faqToDelete) {
						try {
							await deleteFAQ(faqToDelete.id);
							setShowDeleteFAQModal(false);
							setFaqToDelete(null);
						} catch (error) {
							console.error("Error deleting FAQ:", error);
						}
					}
				}}
				faq={faqToDelete}
			/>
		</>
	);
};
