import type { ColumnDef } from "@beweco/aurora-ui";
import type { IUser } from "../../domain/interfaces/user.interface";

/**
 * Props for the UsersHeader component.
 */
export interface UsersHeaderProps {
	userCount: number;
	onInviteUser: () => void;
}

/**
 * Props for the UsersTable component.
 */
export interface UsersTableProps {
	columns: ColumnDef[];
	items: IUser[];
	onEditUser: (user: IUser) => void;
	onDeleteUser: (userId: string) => void;
}
