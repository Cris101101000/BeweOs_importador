import { Button, Card, Pagination, useAuraToast } from "@beweco/aurora-ui";
import { ViewSkeleton } from "@shared/ui/components/view-skeleton";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useEffect } from "react";
import { DeleteUserModal } from "./components/delete-user-modal.component";
import {
	type EditUserFormData,
	EditUserModal,
} from "./components/edit-user-modal.component";
import { InviteUserModal } from "./components/invite-user-modal.component";
import type { InviteUserFormData } from "./components/invite-user-modal.types";
import { UsersHeader } from "./components/users-header.component";
import { UsersTable } from "./components/users-table.component";
import { useDeleteUserModal } from "./hooks/use-delete-user-modal.hook";
import { useDeleteUser } from "./hooks/use-delete-user.hook";
import { useEditUserModal } from "./hooks/use-edit-user-modal.hook";
import { useInviteUserModal } from "./hooks/use-invite-user-modal.hook";
import { useInviteUser } from "./hooks/use-invite-user.hook";
import { useUpdateUser } from "./hooks/use-update-user.hook";
import { useUsers } from "./hooks/use-users.hook";

/**
 * Main component for the Users section.
 * It orchestrates all the child components and hooks for user management.
 */
const Users: React.FC = () => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const { items, pages, page, setPage, isLoading, error, refetch, userCount } =
		useUsers();

	// Modals
	const inviteModal = useInviteUserModal();
	const deleteModal = useDeleteUserModal();
	const editModal = useEditUserModal();

	// Hooks for actions
	const {
		inviteUser,
		isLoading: isInviting,
		isSuccess: isInviteSuccess,
		error: inviteError,
		reset: resetInvite,
	} = useInviteUser();
	const {
		deleteUser,
		isLoading: isDeleting,
		isSuccess: isDeleteSuccess,
		error: deleteError,
		reset: resetDelete,
	} = useDeleteUser();
	const {
		updateUser,
		isLoading: isUpdating,
		isSuccess: isUpdateSuccess,
		error: updateError,
		reset: resetUpdate,
	} = useUpdateUser();

	// Effect for success notifications
	useEffect(() => {
		if (isInviteSuccess) {
			showToast({
				title: t("toast_user_invited_success"),
				color: "success",
			});
			inviteModal.closeModal();
			refetch();
			resetInvite();
		}
		if (isDeleteSuccess) {
			showToast({
				title: t("toast_user_deleted_success"),
				color: "success",
			});
			deleteModal.closeModal();
			refetch();
			resetDelete();
		}
		if (isUpdateSuccess) {
			showToast({
				title: t("toast_user_updated_success"),
				color: "success",
			});
			editModal.closeModal();
			refetch();
			resetUpdate();
		}
	}, [
		isInviteSuccess,
		isDeleteSuccess,
		isUpdateSuccess,
		inviteModal,
		deleteModal,
		editModal,
		refetch,
		resetInvite,
		resetDelete,
		resetUpdate,
		showToast,
		t,
	]);

	// Effect for error notifications
	useEffect(() => {
		const anyError = inviteError || deleteError || updateError;
		if (anyError) {
			showToast({
				title: t("toast_error_generic"),
				description: anyError,
				color: "danger",
			});
		}
	}, [inviteError, deleteError, updateError, showToast, t]);

	const handleInviteUser = (data: InviteUserFormData) => {
		inviteUser(data.email, [data.role]);
	};

	const handleDeleteConfirm = () => {
		if (deleteModal.userToDelete) {
			deleteUser(deleteModal.userToDelete);
		}
	};

	const handleEditUser = (data: EditUserFormData) => {
		if (editModal.userToEdit) {
			updateUser(editModal.userToEdit.id, {
				...data,
				roles: [{ value: data.role, label: data.role }],
			});
		}
	};

	if (isLoading) {
		return <ViewSkeleton variant="table" />;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		<>
			<div className="pt-1 w-full gap-4">
				<Card className="p-5 w-full gap-4">
					<UsersHeader
						userCount={userCount}
						onInviteUser={inviteModal.openModal}
					/>
					<UsersTable
						onEditUser={editModal.openModal}
						onDeleteUser={deleteModal.openModal}
						columns={[
							{ key: "users", label: t("role_user") },
							{ key: "email", label: t("field_email") },
							{ key: "role", label: t("field_role") },
							{ key: "lastAccess", label: t("last_access") },
							{ key: "actions", label: t("actions") },
						]}
						items={items}
					/>
					<div className="flex justify-between items-center mt-6 px-1">
						<Pagination
							total={pages}
							page={page}
							onChange={setPage}
							size="sm"
							showControls
							isCompact
							showShadow
						/>
						<div className="flex gap-2 items-center">
							<Button
								color="default"
								size="sm"
								variant="flat"
								isDisabled={page === 1}
								onPress={() => setPage(page - 1)}
							>
								{t("button_previous")}
							</Button>
							<Button
								color="default"
								size="sm"
								variant="flat"
								isDisabled={page === pages}
								onPress={() => setPage(page + 1)}
							>
								{t("button_next")}
							</Button>
						</div>
					</div>
				</Card>
			</div>

			<InviteUserModal
				isOpen={inviteModal.isModalOpen}
				onClose={inviteModal.closeModal}
				onInvite={handleInviteUser}
			/>
			<DeleteUserModal
				isOpen={deleteModal.isModalOpen}
				onClose={deleteModal.closeModal}
				onConfirm={handleDeleteConfirm}
			/>
			<EditUserModal
				isOpen={editModal.isModalOpen}
				onClose={editModal.closeModal}
				onEdit={handleEditUser}
				user={editModal.userToEdit}
			/>
		</>
	);
};

export default Users;
