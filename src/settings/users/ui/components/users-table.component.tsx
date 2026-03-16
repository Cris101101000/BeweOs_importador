import {
	AuraTable,
	Avatar,
	Button,
	IconComponent,
	type TableItem,
} from "@beweco/aurora-ui";
import { getFullName } from "@shared/utils/user-name.utils";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import type { IUser } from "../../domain/interfaces/user.interface";
import type { UsersTableProps } from "./users.types";

/**
 * Renders a single cell in the users table with custom content based on the column key.
 *
 * @param user - The user object for the current row.
 * @param columnKey - The key of the column being rendered.
 * @param onEditUser - Callback to handle the edit action.
 * @param onDeleteUser - Callback to handle the delete action.
 */
const renderCell = (
	user: IUser,
	columnKey: React.Key,
	onEditUser: (user: IUser) => void,
	onDeleteUser: (userId: string) => void,
	t: (key: string) => string
) => {
	switch (columnKey) {
		case "users":
			return (
				<div className="flex items-center gap-3">
					<Avatar
						src={user.avatar}
						name={getFullName(user.firstname, user.lastname)}
						size="sm"
					/>
					<div className="flex flex-col">
						<p className="text-sm text-foreground">
							{getFullName(user.firstname, user.lastname)}
						</p>
					</div>
				</div>
			);
		case "email":
			return <p className="text-sm text-foreground">{user.email}</p>;
		case "role":
			return (
				<p className="text-sm text-foreground">
					{user.roles.map((role) => t(role.label)).join(", ")}
				</p>
			);
		case "lastAccess":
			return (
				<div className="flex items-center gap-2">
					<IconComponent
						size="sm"
						icon={"solar:calendar-minimalistic-outline"}
						className="text-default-400 dark:text-default-500"
					/>
					<p className="text-sm text-foreground">{user.lastAccess}</p>
				</div>
			);
		case "actions":
			return (
				<div className="flex items-center gap-2">
					<Button
						color="default"
						size="sm"
						variant="light"
						isIconOnly
						onPress={() => onEditUser(user)}
						className="text-default-400 dark:text-default-500"
						startContent={
							<IconComponent
								icon={"solar:pen-2-outline"}
								className="text-default-400 dark:text-default-500"
							/>
						}
					/>
					<Button
						color="default"
						size="sm"
						variant="light"
						isIconOnly
						onPress={() => onDeleteUser(user.id)}
						className="text-default-400 dark:text-default-500"
						startContent={
							<IconComponent
								icon={"solar:trash-bin-minimalistic-outline"}
								className="text-default-400 dark:text-default-500"
							/>
						}
					/>
				</div>
			);
		default:
			return null;
	}
};

/**
 * Renders the main table of users, including columns and custom cell rendering.
 *
 * @param {UsersTableProps} props - The props for the component.
 */
export const UsersTable: React.FC<UsersTableProps> = ({
	items,
	columns,
	onEditUser,
	onDeleteUser,
}) => {
	const { t } = useTranslate();

	return (
		<AuraTable
			aria-label="Tabla de usuarios del equipo"
			className="w-full"
			classNames={{
				th: "bg-gray-50 dark:bg-default-100 text-xs font-semibold text-foreground-600 dark:text-foreground-500 uppercase tracking-wider",
				td: "py-4",
			}}
			items={items as unknown as TableItem[]}
			columns={columns}
			renderCell={(item, columnKey) =>
				renderCell(
					item as unknown as IUser,
					columnKey,
					onEditUser,
					onDeleteUser,
					t
				)
			}
		/>
	);
};
