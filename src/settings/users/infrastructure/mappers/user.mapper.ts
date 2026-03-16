import type { IRole, IUser } from "../../domain/interfaces/user.interface";
import type { GetUsersResponseDto } from "../dto/users.dto";

const roleMapping: { [key: string]: string } = {
	admin: "role_admin",
	user: "role_user",
	editor: "role_editor",
	viewer: "role_viewer",
	moderator: "role_moderator",
	manager: "role_manager",
};

/**
 * Formats the last access date from ISO string to readable format.
 */
const formatLastAccess = (isoDate: string | null): string => {
	if (!isoDate) return "Never";

	const date = new Date(isoDate);
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};

	return date.toLocaleDateString("en-US", options);
};

/**
 * Maps the GetUsersResponseDto to an array of IUser domain objects.
 */
export const mapUsersDtoToDomain = (dto: GetUsersResponseDto): IUser[] => {
	return dto.users.map((userDto) => ({
		id: userDto.id,
		firstname: userDto.basicInfo?.firstname ?? "N/A",
		lastname: userDto.basicInfo?.lastname,
		username: userDto.basicInfo?.email ?? "N/A",
		email: userDto.basicInfo?.email ?? "N/A",
		roles:
			userDto.authorization?.roles
				?.map((role): IRole | undefined =>
					roleMapping[role.name]
						? { value: role.name, label: roleMapping[role.name] }
						: { value: role.name, label: role.description || role.name }
				)
				.filter((role): role is IRole => !!role) ?? [],
		lastAccess: formatLastAccess(userDto.authentication?.lastLoginAt),
		avatar: userDto.basicInfo?.imageProfile ?? "",
		isAdmin: userDto.isAdmin,
		status: userDto.status,
	}));
};
