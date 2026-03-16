/**
 * Defines the shape of the data for the user invitation form.
 */
export interface InviteUserFormData {
	email: string;
	role: string;
}

/**
 * Props for the InviteUserModal component.
 */
export interface InviteUserModalProps {
	/** Controls if the modal is open or closed. */
	isOpen: boolean;
	/** Function to be called when the modal is closed. */
	onClose: () => void;
	/** Function to be called with the form data when the invitation is sent. */
	onInvite: (data: InviteUserFormData) => void;
}
