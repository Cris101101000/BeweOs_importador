import {
	Button,
	H2,
	H4,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	P,
	Spinner,
	TagsFilter,
	useAuraToast,
} from "@beweco/aurora-ui";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import { toAiTagFromEntityAssignmentWithAssignmentId } from "@clients/infrastructure/mappers/smart-tag-to-ai-tag.mapper";
import { useAiTags } from "@clients/ui/features/contact-details/hooks/use-ai-tags.hook";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { ApplicableEntity } from "@smart-tags/domain/enums/applicable-entity.enum";
import { SmartTagStatus } from "@smart-tags/domain/enums/smart-tag-status.enum";
import type { ICreateTagAssignment } from "@smart-tags/domain/interfaces/tag-assignment.interface";
import { AssignmentSmartTagAdapter } from "@smart-tags/infrastructure/adapters/assignment-smart-tags.adapter";
import { mapToApplicableEntities } from "@smart-tags/infrastructure/utils/applicable-entities-mapper.util";
import {
	type CreateSmartTagFormData,
	CreateSmartTagModal,
} from "@smart-tags/ui/components/create-smart-tag-modal/create-smart-tag-modal.component";
import { useSmartTags } from "@smart-tags/ui/hooks/use-smart-tags-hook";

interface ManageTagsModalProps {
	isOpen: boolean;
	onClose: () => void;
	clientId: string;
	onTagsUpdated?: () => void;
}

export const ManageTagsModal: FC<ManageTagsModalProps> = ({
	isOpen,
	onClose,
	clientId,
	onTagsUpdated,
}) => {
	const { t } = useTranslate();
	const {
		aiTags,
		isLoading: isLoadingAiTags,
		error: aiTagsError,
	} = useAiTags();

	const [currentTags, setCurrentTags] = useState<IAiTag[]>([]);
	const [isLoadingClientTags, setIsLoadingClientTags] = useState(false);
	const [clientTagsError, setClientTagsError] = useState<string | null>(null);
	const [isSyncingTags, setIsSyncingTags] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const { showToast } = useAuraToast();

	// Adapter instance for tag operations
	const assignmentAdapter = useRef(new AssignmentSmartTagAdapter());

	// State for create smart tag modal
	const [isCreateSmartTagModalOpen, setIsCreateSmartTagModalOpen] =
		useState(false);
	const [pendingTagName, setPendingTagName] = useState("");

	// Smart tags hook for creating new smart tags
	const { createSmartTag, isLoading: isCreatingSmartTag } = useSmartTags();

	/**
	 * Fetches the client's assigned tags from the API
	 */
	const fetchClientTags = useCallback(async () => {
		if (!clientId) return;

		setIsLoadingClientTags(true);
		setClientTagsError(null);

		try {
			const assignedTags =
				await assignmentAdapter.current.getAssignmentsByEntity(
					"CLIENT",
					clientId
				);
			console.log(`🚀 MANAGE TAGS MODAL: Assigned tags:`, assignedTags);
			// Convert IEntityAssignedTag[] to IAiTag[]
			const mappedTags = assignedTags.map(
				toAiTagFromEntityAssignmentWithAssignmentId
			);
			setCurrentTags(mappedTags);
		} catch (error) {
			console.error("Error fetching client tags:", error);
			setClientTagsError(
				error instanceof Error
					? error.message
					: "Error al cargar las etiquetas del cliente"
			);
			setCurrentTags([]);
		} finally {
			setIsLoadingClientTags(false);
		}
	}, [clientId]);

	// Fetch client's assigned tags when modal opens
	useEffect(() => {
		if (isOpen) {
			fetchClientTags();
			setHasChanges(false);
		}
	}, [isOpen, fetchClientTags]);

	// Handle modal close with conditional refetch
	const handleModalClose = useCallback(() => {
		if (hasChanges) {
			onTagsUpdated?.();
		}
		onClose();
	}, [hasChanges, onTagsUpdated, onClose]);

	/**
	 * Syncs TagsFilter selection with API: assigns added tags, deletes removed ones, then refetches.
	 * currentTags use id = assignmentId (for delete); aiTags use id = tagId (for assign).
	 */
	const handleTagsFilterChange = useCallback(
		async (newSelected: IAiTag[]) => {
			const added = newSelected.filter(
				(t) => !currentTags.some((c) => c.value === t.value)
			);
			const removed = currentTags.filter(
				(c) => !newSelected.some((t) => t.value === c.value)
			);

			if (added.length === 0 && removed.length === 0) return;

			setIsSyncingTags(true);
			try {
				for (const tag of removed) {
					if (tag.id) {
						await assignmentAdapter.current.deleteAssignment(tag.id);
					}
				}
				for (const tag of added) {
					const tagId = tag.id ?? aiTags.find((a) => a.value === tag.value)?.id;
					if (tagId) {
						const assignment: ICreateTagAssignment = {
							tagId,
							entityType: "CLIENT",
							entityId: clientId,
							status: "ACTIVE",
						};
						await assignmentAdapter.current.assignTag(assignment);
					}
				}
				setHasChanges(true);
				await fetchClientTags();
				if (added.length > 0 || removed.length > 0) {
					showToast(
						configureSuccessToast(
							t("tag_assigned_success", "Etiquetas actualizadas correctamente")
						)
					);
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: t("manage_tags_error", "Error al actualizar etiquetas");
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						errorMessage
					)
				);
				await fetchClientTags();
			} finally {
				setIsSyncingTags(false);
			}
		},
		[clientId, currentTags, aiTags, t, showToast, fetchClientTags]
	);

	/**
	 * Opens the create smart tag modal (optionally with a preselected name).
	 */
	const handleOpenCreateSmartTagModal = (tagName?: string) => {
		setPendingTagName(tagName ?? "");
		setIsCreateSmartTagModalOpen(true);
	};

	/**
	 * Handles the creation of a new smart tag and assigns it to the current client
	 */
	const handleCreateSmartTagSubmit = async (
		formData: CreateSmartTagFormData
	) => {
		// Parse keywords from comma-separated string to array
		const keywordsArray = formData.keywords
			? formData.keywords
					.split(",")
					.map((k: string) => k.trim())
					.filter((k: string) => k.length > 0)
			: [];

		const tagData = {
			name: formData.name.trim(),
			description: formData.description.trim(),
			keywords: keywordsArray,
			color: formData.color,
			type: formData.types[0],
			status: SmartTagStatus.ACTIVE, // Set to ACTIVE so it can be used immediately
			applicableEntities: mapToApplicableEntities(formData.applicableEntities),
			isCustom: true,
			isTemporary: formData.isTemporary,
			temporaryDuration:
				formData.isTemporary && formData.temporaryDuration
					? Number.parseInt(formData.temporaryDuration, 10)
					: undefined,
			_applicableEntitiesOverride: formData.applicableEntities,
		} as Parameters<typeof createSmartTag>[0] & {
			_applicableEntitiesOverride?: string[];
		};

		// Create the smart tag
		const createdSmartTag = await createSmartTag(tagData);

		// Now assign the created tag to the client using the correct endpoint
		if (createdSmartTag) {
			try {
				const assignmentAdapter = new AssignmentSmartTagAdapter();

				const assignment: ICreateTagAssignment = {
					tagId: createdSmartTag.id,
					entityType: "CLIENT",
					entityId: clientId,
					status: "ACTIVE",
				};

				await assignmentAdapter.assignTag(assignment);

				setPendingTagName("");
				setHasChanges(true);
				await fetchClientTags();

				showToast(
					configureSuccessToast(
						t(
							"tag_created_and_assigned_success",
							"Etiqueta creada y asignada exitosamente"
						)
					)
				);
			} catch (assignError) {
				// Tag was created but couldn't be assigned
				console.error("Error assigning tag:", assignError);
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Warning,
						t,
						t(
							"tag_created_but_not_assigned",
							"La etiqueta fue creada pero no se pudo asignar al cliente"
						)
					)
				);
			}
		}

		// Close the modal
		setIsCreateSmartTagModalOpen(false);
	};

	/**
	 * Handles closing the create smart tag modal
	 */
	const handleCloseCreateSmartTagModal = () => {
		setIsCreateSmartTagModalOpen(false);
		setPendingTagName("");
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleModalClose}
				size="lg"
				placement="center"
				scrollBehavior="inside"
				aria-labelledby="manage-tags-modal-title"
				aria-describedby="manage-tags-modal-description"
			>
				<ModalContent>
					<>
						<ModalHeader className="flex flex-col p-0">
							<H2 id="manage-tags-modal-title">
								{t("manage_tags_modal_title", "Gestionar etiquetas")}
							</H2>
							<P className="text-small" id="manage-tags-modal-description">
								{t(
									"manage_tags_modal_description",
									"Crea o selecciona etiquetas sugeridas"
								)}
							</P>
						</ModalHeader>
						<ModalBody className="p-0">
							<div className="flex flex-col gap-4 mt-4">
								{/* Loading State */}
								{(isLoadingAiTags || isLoadingClientTags) && (
									<output
										className="flex justify-center items-center py-8"
										aria-live="polite"
									>
										<Spinner size="lg" aria-hidden="true" />
										<P className="ml-2">
											{t("manage_tags_loading", "Cargando etiquetas...")}
										</P>
									</output>
								)}

								{/* Error State */}
								{(aiTagsError || clientTagsError) && (
									<div
										className="bg-danger-50 border border-danger-200 rounded-lg p-4"
										role="alert"
										aria-live="assertive"
									>
										<P className="text-danger-700">
											{t("manage_tags_error", "Error al cargar etiquetas:")}{" "}
											{aiTagsError || clientTagsError}
										</P>
									</div>
								)}

								{/* Content - Only show when not loading */}
								{!isLoadingAiTags && !isLoadingClientTags && (
									<>
										<div className="flex flex-col gap-3">
											<div className="flex flex-row items-center justify-between gap-2">
												<H4>
													{t(
														"manage_tags_create_tag",
														"Selecciona o crea etiquetas"
													)}
												</H4>
												<Button
													variant="flat"
													color="primary"
													size="sm"
													onPress={() => handleOpenCreateSmartTagModal()}
													isDisabled={isSyncingTags}
													aria-label={t("button_create_tag", "Crear etiqueta")}
												>
													{t("button_create_tag", "Crear etiqueta")}
												</Button>
											</div>
											<TagsFilter
												value={currentTags}
												items={aiTags ?? []}
												onChange={handleTagsFilterChange}
												isLoading={isLoadingAiTags || isLoadingClientTags || isSyncingTags}
											/>
										</div>
									</>
								)}
							</div>
						</ModalBody>
					</>
				</ModalContent>
			</Modal>

			{/* Create Smart Tag Modal */}
			<CreateSmartTagModal
				isOpen={isCreateSmartTagModalOpen}
				onClose={handleCloseCreateSmartTagModal}
				onSubmit={handleCreateSmartTagSubmit}
				isLoading={isCreatingSmartTag}
				initialName={pendingTagName}
				defaultApplicableEntities={[ApplicableEntity.CLIENT]}
			/>
		</>
	);
};
