import {
	Avatar,
	Button,
	IconComponent,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tab,
	Tabs,
	useAuraToast,
} from "@beweco/aurora-ui";
import { EnumOrder } from "@clients/domain/enums/order.enum";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import { useClientsByFilter } from "@clients/ui/features/contact-list/hooks/use-clients-by-filter.hook";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApplicableEntity } from "../../../domain/enums/applicable-entity.enum";
import { useAssignTag } from "../../hooks/use-assign-tag.hook";

export interface AssignSmartTagModalProps {
	isOpen: boolean;
	onClose: () => void;
	tagId: string;
	onAssign?: (entityType: ApplicableEntity, selectedItems: string[]) => void;
}

export const AssignSmartTagModal: React.FC<AssignSmartTagModalProps> = ({
	isOpen,
	onClose,
	tagId,
	onAssign,
}) => {
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const { assignTag, isLoading: isAssigning } = useAssignTag();
	const [entityType, setEntityType] = useState<ApplicableEntity>(
		ApplicableEntity.CLIENT
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedItems, setSelectedItems] = useState<string[]>([]);

	// Filters for clients API
	const initialFilters = useMemo<IClientFilter>(
		() => ({
			limit: 100, // Get a good amount of clients
			offset: 0,
			order: EnumOrder.CreatedAt,
		}),
		[]
	);

	const {
		result: clientsResult,
		isLoading: isLoadingClients,
		setFilters: updateClientFilters,
	} = useClientsByFilter(initialFilters);

	// Update filters when search query changes (for clients)
	useEffect(() => {
		if (entityType === ApplicableEntity.CLIENT && searchQuery.trim()) {
			updateClientFilters({
				...initialFilters,
			});
		} else if (entityType === ApplicableEntity.CLIENT) {
			updateClientFilters(initialFilters);
		}
	}, [entityType, searchQuery, initialFilters, updateClientFilters]);

	// Mock data for conversations (keeping as is for now)
	const availableConversations = useMemo(
		() => [
			{
				id: "201",
				customerName: "Patricia González",
				lastMessage: "¿Cuál es el precio?",
				messagesCount: 12,
			},
			{
				id: "202",
				customerName: "Miguel Ángel Castro",
				lastMessage: "Perfecto, gracias",
				messagesCount: 8,
			},
			{
				id: "203",
				customerName: "Elena Vargas",
				lastMessage: "¿Tienen envío a domicilio?",
				messagesCount: 15,
			},
			{
				id: "204",
				customerName: "Francisco Navarro",
				lastMessage: "Me interesa el servicio",
				messagesCount: 5,
			},
		],
		[]
	);

	// Map clients from API to the format used in the modal
	const availableClients = useMemo(() => {
		if (!clientsResult?.clients) return [];

		return clientsResult.clients.map((client) => ({
			id: client.id || "",
			name: client.name,
			email: client.email,
			phone: client.phones?.[0]?.number || "",
			avatarUrl: client.avatarUrl || null,
		}));
	}, [clientsResult]);

	// Filter items based on search
	const filteredItems = useMemo(() => {
		const items =
			entityType === ApplicableEntity.CLIENT
				? availableClients
				: availableConversations;
		if (!searchQuery.trim()) return items;

		const query = searchQuery.toLowerCase();
		return items.filter((item) => {
			if (entityType === ApplicableEntity.CLIENT) {
				return (
					(item as any).name.toLowerCase().includes(query) ||
					(item as any).email.toLowerCase().includes(query)
				);
			} else {
				return (item as any).customerName.toLowerCase().includes(query);
			}
		});
	}, [entityType, searchQuery, availableClients, availableConversations]);

	// Get label for entity type
	const getEntityLabel = useCallback(
		(type: ApplicableEntity, count: number) => {
			if (type === ApplicableEntity.CLIENT) {
				return count === 1
					? t("smart_tags_assign_entity_client_singular", "cliente")
					: t("smart_tags_assign_entity_client_plural", "clientes");
			}
			return count === 1
				? t("smart_tags_assign_entity_conversation_singular", "conversación")
				: t("smart_tags_assign_entity_conversation_plural", "conversaciones");
		},
		[t]
	);

	// Handle assignment
	const handleAssign = useCallback(async () => {
		if (!tagId || selectedItems.length === 0) {
			return;
		}

		try {
			await assignTag(tagId, entityType, selectedItems);

			showToast({
				color: "success",
				title: t("smart_tags_toast_assigned_title", "Etiqueta asignada"),
				description: t("smart_tags_toast_assigned_description", {
					count: selectedItems.length,
					entity: getEntityLabel(entityType, selectedItems.length),
				}),
			});

			if (onAssign) {
				onAssign(entityType, selectedItems);
			}

			setSelectedItems([]);
			setSearchQuery("");
			onClose();
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: t("smart_tags_toast_assign_error", "Error al asignar la etiqueta");
			showToast({
				color: "danger",
				title: t("message_error", "Error"),
				description: errorMessage,
			});
		}
	}, [
		tagId,
		entityType,
		selectedItems,
		assignTag,
		onAssign,
		onClose,
		showToast,
	]);

	// Handle modal close
	const handleClose = useCallback(() => {
		setSelectedItems([]);
		setSearchQuery("");
		onClose();
	}, [onClose]);

	// Reset selection when switching tabs
	const handleTabChange = useCallback((key: string | number) => {
		setEntityType(key as ApplicableEntity);
		setSelectedItems([]);
		setSearchQuery("");
	}, []);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="2xl"
			placement="center"
			scrollBehavior="inside"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<h3 className="text-xl font-bold">
								{t("smart_tags_assign_modal_title", "Asignar etiqueta")}
							</h3>
							<p className="text-sm text-default-500 font-normal">
								{t(
									"smart_tags_assign_modal_subtitle",
									"Selecciona los clientes o conversaciones a los que deseas asignar esta etiqueta"
								)}
							</p>
						</ModalHeader>
						<ModalBody>
							{/* Tabs for switching between entity types */}
							<Tabs
								selectedKey={entityType}
								onSelectionChange={handleTabChange}
								className="mb-4"
							>
								<Tab
									key={ApplicableEntity.CLIENT}
									title={
										<div className="flex items-center gap-2">
											<IconComponent icon="solar:user-bold" size="sm" />
											<span>
												{t("smart_tags_applicable_client", "Clientes")}
											</span>
										</div>
									}
								/>
								<Tab
									key={ApplicableEntity.COMMUNICATION}
									title={
										<div className="flex items-center gap-2">
											<IconComponent
												icon="solar:chat-round-dots-bold"
												size="sm"
											/>
											<span>
												{t(
													"smart_tags_applicable_communication",
													"Conversaciones"
												)}
											</span>
										</div>
									}
								/>
							</Tabs>

							{/* Search */}
							<Input
								placeholder={
									entityType === ApplicableEntity.CLIENT
										? t(
												"smart_tags_assign_search_client_placeholder",
												"Buscar por nombre o email..."
											)
										: t(
												"smart_tags_assign_search_conversation_placeholder",
												"Buscar por nombre..."
											)
								}
								value={searchQuery}
								onValueChange={setSearchQuery}
								startContent={
									<IconComponent icon="solar:magnifer-outline" size="sm" />
								}
								isClearable
								onClear={() => setSearchQuery("")}
								className="mb-4"
							/>

							{/* List of items */}
							<div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
								{entityType === ApplicableEntity.CLIENT && isLoadingClients ? (
									<div className="text-center py-8 text-default-500">
										<IconComponent
											icon="solar:refresh-outline"
											className="mx-auto mb-2 animate-spin"
											width={48}
											height={48}
										/>
										<p className="text-sm">
											{t("smart_tags_assign_loading", "Cargando clientes...")}
										</p>
									</div>
								) : (
									<>
										{filteredItems.map((item) => {
											const isSelected = selectedItems.includes(item.id);
											return (
												<div
													key={item.id}
													onClick={() => {
														if (isSelected) {
															setSelectedItems(
																selectedItems.filter((id) => id !== item.id)
															);
														} else {
															setSelectedItems([...selectedItems, item.id]);
														}
													}}
													className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
														isSelected
															? "border-primary-500 bg-primary-50"
															: "border-default-200 hover:border-default-400"
													}`}
												>
													<div className="flex items-center gap-3">
														<div
															className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
																isSelected
																	? "border-primary-500 bg-primary-500"
																	: "border-default-300"
															}`}
														>
															{isSelected && (
																<IconComponent
																	icon="solar:check-outline"
																	className="text-white"
																	width={14}
																	height={14}
																/>
															)}
														</div>
														<Avatar
															name={
																entityType === ApplicableEntity.CLIENT
																	? (item as any).name
																	: (item as any).customerName
															}
															size="sm"
															src={(item as any).avatarUrl}
														/>
														<div className="flex-1">
															{entityType === ApplicableEntity.CLIENT ? (
																<>
																	<p className="text-sm font-medium text-default-900">
																		{(item as any).name}
																	</p>
																	<p className="text-xs text-default-500">
																		{(item as any).email}
																	</p>
																</>
															) : (
																<>
																	<p className="text-sm font-medium text-default-900">
																		{(item as any).customerName}
																	</p>
																	<p className="text-xs text-default-500">
																		{(item as any).messagesCount} mensajes
																	</p>
																</>
															)}
														</div>
													</div>
												</div>
											);
										})}
										{filteredItems.length === 0 && !isLoadingClients && (
											<div className="text-center py-8 text-default-500">
												<IconComponent
													icon="solar:inbox-outline"
													className="mx-auto mb-2"
													width={48}
													height={48}
												/>
												<p className="text-sm">
													{t(
														"smart_tags_assign_no_results",
														"No se encontraron resultados"
													)}
												</p>
											</div>
										)}
									</>
								)}
							</div>

							{/* Selected count */}
							{selectedItems.length > 0 && (
								<div className="mt-4 p-3 bg-primary-50 rounded-lg">
									<p className="text-sm text-primary-700">
										{t("smart_tags_assign_selected_count", {
											count: selectedItems.length,
											entity: getEntityLabel(entityType, selectedItems.length),
										})}
									</p>
								</div>
							)}
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" color="default" onPress={handleClose}>
								{t("button_cancel", "Cancelar")}
							</Button>
							<Button
								color="primary"
								onPress={handleAssign}
								isDisabled={selectedItems.length === 0 || isAssigning}
								isLoading={isAssigning}
								startContent={
									!isAssigning && (
										<IconComponent icon="solar:check-circle-outline" />
									)
								}
							>
								{isAssigning
									? t("smart_tags_assign_button_loading", "Asignando...")
									: t("smart_tags_assign_button", {
											count: selectedItems.length,
										})}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
