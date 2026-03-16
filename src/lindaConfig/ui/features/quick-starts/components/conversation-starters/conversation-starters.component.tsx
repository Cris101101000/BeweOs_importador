import {
	Button,
	Card,
	H4,
	IconComponent,
	P,
	Spinner,
	Switch,
	useAuraToast,
} from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { ConfirmDeleteModal } from "@shared/ui/components/confirm-delete-modal/confirm-delete-modal";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import type { QuickStart } from "../../../../../domain/quick-starts/interfaces";
import { useQuickStarts } from "../../hooks";
import { CreateQuickStartModal } from "../create-quick-start-modal";
import { EditQuickStartModal } from "../edit-quick-start-modal";

export const ConversationStarters = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();

	// Hook conectado al API
	const {
		quickStarts,
		isLoading,
		createQuickStart,
		updateQuickStart,
		deleteQuickStart,
		toggleQuickStartActive,
	} = useQuickStarts();

	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedStarter, setSelectedStarter] = useState<QuickStart | null>(
		null
	);
	const [starterToDelete, setStarterToDelete] = useState<QuickStart | null>(
		null
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleCreate = async (data: { text: string; icon: string }) => {
		if (!data.text.trim()) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Validation,
					t,
					"linda_quick_starts_empty_text_error",
					"linda_quick_starts_empty_text_error"
				)
			);
			return;
		}

		setIsSubmitting(true);
		try {
			await createQuickStart({
				text: data.text,
				icon: data.icon,
				isActive: true,
			});

			setShowCreateModal(false);

			showToast(configureSuccessToast(t("linda_quick_starts_created_success")));
		} catch (error) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"linda_quick_starts_create_error",
					"try_again"
				)
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (starter: QuickStart) => {
		setSelectedStarter(starter);
		setShowEditModal(true);
	};

	const handleUpdate = async (data: { text: string; icon: string }) => {
		if (!selectedStarter || !data.text.trim()) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Validation,
					t,
					"linda_quick_starts_empty_text_error",
					"linda_quick_starts_empty_text_error"
				)
			);
			return;
		}

		setIsSubmitting(true);
		try {
			await updateQuickStart(selectedStarter.id, {
				text: data.text,
				icon: data.icon,
			});

			setShowEditModal(false);
			setSelectedStarter(null);

			showToast(configureSuccessToast(t("linda_quick_starts_updated_success")));
		} catch (error) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"linda_quick_starts_update_error",
					"try_again"
				)
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = (id: string) => {
		const starter = quickStarts.find((s) => s.id === id);
		if (starter) {
			setStarterToDelete(starter);
			setShowDeleteModal(true);
		}
	};

	const confirmDelete = async () => {
		if (starterToDelete) {
			setIsSubmitting(true);
			try {
				await deleteQuickStart(starterToDelete.id);
				setShowDeleteModal(false);
				setStarterToDelete(null);

				showToast(
					configureSuccessToast(t("linda_quick_starts_deleted_success"))
				);
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"linda_quick_starts_delete_error",
						"try_again"
					)
				);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleToggleActive = async (id: string, currentStatus: boolean) => {
		try {
			await toggleQuickStartActive(id, !currentStatus);
		} catch (error) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"linda_quick_starts_toggle_error",
					"try_again"
				)
			);
		}
	};

	// Loading state
	if (isLoading ) {
		return (
			<div className="flex items-center justify-center py-12">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header Section */}
			<div className="flex items-center justify-between">
				<div>
					<H4>{t("linda_quick_starts_title")}</H4>
					<P className="text-sm text-default-500">
						{t("linda_quick_starts_description")}
					</P>
				</div>
				<Button
					color="primary"
					size="sm"
					onPress={() => setShowCreateModal(true)}
					startContent={
						<IconComponent icon="solar:add-circle-bold" size="sm" />
					}
				>
					{t("linda_quick_starts_add_button")}
				</Button>
			</div>

			{/* Starters Grid */}
			{quickStarts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{quickStarts.map((starter) => (
						<Card
							key={starter.id}
							className={`overflow-hidden transition-all duration-300 border-2 ${starter.isActive ? "border-default-300 shadow-md hover:shadow-lg" : "border-default-200 shadow-sm hover:shadow-md"}`}
						>
							{/* Compact Preview Section */}
							<div
								className={`p-4 ${starter.isActive ? "bg-gradient-to-br from-default-50 to-default-100" : "bg-gradient-to-br from-default-50 to-default-100/50"} border-b`}
							>
								<div className="flex items-center justify-between mb-3">
									<P className="text-xs text-default-500 uppercase tracking-wide font-semibold">
										{t("linda_quick_starts_preview")}
									</P>
									<div className="flex items-center gap-2">
										<Switch
											isSelected={starter.isActive}
											onValueChange={() =>
												handleToggleActive(starter.id, starter.isActive)
											}
											color="success"
											size="sm"
										/>
										<P
											className={`text-xs font-medium ${starter.isActive ? "text-default-900" : "text-default-400"}`}
										>
											{starter.isActive
												? t("linda_quick_starts_status_active")
												: t("linda_quick_starts_status_inactive")}
										</P>
									</div>
								</div>

								{/* Button Preview - Compact */}
								<div
									className={`inline-block bg-white rounded-full px-4 py-2 border-2 ${starter.isActive ? "border-default-300 hover:border-default-400" : "border-default-200 hover:border-default-300"} shadow-sm transition-all cursor-pointer`}
								>
									<P
										className={`text-xs font-normal whitespace-nowrap ${starter.isActive ? "text-default-900" : "text-default-400"}`}
									>
										{starter.text}
									</P>
								</div>
							</div>

							{/* Compact Actions Section */}
							<div className="px-4 py-2.5 bg-white">
								<div className="flex items-center justify-end gap-2">
									<Button
										variant="light"
										size="sm"
										isIconOnly
										onPress={() => handleEdit(starter)}
										startContent={
											<IconComponent
												icon="solar:pen-outline"
												size="sm"
												className="text-default-600"
											/>
										}
										className="h-7 w-7 min-w-7"
									/>
									<Button
										variant="light"
										size="sm"
										color="danger"
										isIconOnly
										onPress={() => handleDelete(starter.id)}
										startContent={
											<IconComponent
												icon="solar:trash-bin-minimalistic-outline"
												size="sm"
											/>
										}
										className="h-7 w-7 min-w-7 flex-shrink-0"
									/>
								</div>
							</div>
						</Card>
					))}
				</div>
			) : (
				<Card className="p-8 text-center bg-gradient-to-br from-default-50 to-white">
					<div className="max-w-sm mx-auto">
						<div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
							<IconComponent
								icon="solar:chat-square-code-bold"
								size="lg"
								className="text-primary-500"
							/>
						</div>
						<H4 className="mb-2 text-base">
							{t("linda_quick_starts_empty_title")}
						</H4>
						<P className="text-sm text-default-500 mb-4">
							{t("linda_quick_starts_empty_description")}
						</P>
						<Button
							color="primary"
							size="md"
							onPress={() => setShowCreateModal(true)}
							startContent={
								<IconComponent icon="solar:add-circle-bold" size="sm" />
							}
						>
							{t("linda_quick_starts_create_first_button")}
						</Button>
					</div>
				</Card>
			)}

			{/* Create Modal */}
			<CreateQuickStartModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				onSubmit={handleCreate}
				isSubmitting={isSubmitting}
			/>

			{/* Edit Modal */}
			<EditQuickStartModal
				isOpen={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setSelectedStarter(null);
				}}
				onSubmit={handleUpdate}
				isSubmitting={isSubmitting}
				initialData={
					selectedStarter
						? { text: selectedStarter.text, icon: selectedStarter.icon }
						: null
				}
			/>

			{/* Delete Confirmation Modal */}
			<ConfirmDeleteModal
				isOpen={showDeleteModal}
				onClose={() => {
					setShowDeleteModal(false);
					setStarterToDelete(null);
				}}
				onConfirm={confirmDelete}
				title={t("linda_quick_starts_delete_title")}
				description={t("linda_quick_starts_delete_description")}
				itemName={starterToDelete?.text}
			/>
		</div>
	);
};
