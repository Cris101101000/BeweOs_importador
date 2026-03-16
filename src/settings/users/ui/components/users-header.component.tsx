import { Button, Chip, IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import type { UsersHeaderProps } from "./users.types";

/**
 * Renders the header for the users table.
 * Displays the title, total user count, and an "Invite User" button.
 *
 * @param {UsersHeaderProps} props - The props for the component.
 */
export const UsersHeader: React.FC<UsersHeaderProps> = ({
	userCount,
	onInviteUser,
}) => {
	const { t } = useTranslate();

	return (
		<div className="flex justify-between items-center mb-6 px-1">
			<div className="flex items-center gap-3">
				<h2 className="font-medium text-lg text-foreground">
					{t("settings_users")}
				</h2>
				<Chip size="sm" variant="flat" color="default">
					{userCount}
				</Chip>
			</div>
			<Button
				variant="solid"
				endContent={
					<IconComponent icon="solar:add-circle-bold" className="text-white" />
				}
				onPress={onInviteUser}
			>
				{t("button_invite")}
			</Button>
		</div>
	);
};
