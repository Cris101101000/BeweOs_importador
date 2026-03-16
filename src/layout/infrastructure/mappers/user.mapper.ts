import type { EnumLanguage } from "@shared/domain/enums/enum-language.enum";
import type { EnumTheme } from "@shared/domain/enums/enum-theme.enum";
import type { EnumPlatformType } from "../../domain/enums/enum-platform-type.enum";
import type { IUser } from "../../domain/interfaces/user.interface";

import type { DtoGetUserData } from "../dtos/get-init-user.dto";

const roleTranslationMap: Record<string, string> = {
	admin: "Administrador",
	seller: "Vendedor",
};

export const mapDtoToUser = (dto: DtoGetUserData["user"]): IUser => {
	return {
		id: dto.id,
		isAdmin: dto.isAdmin,
		roles: dto.roles.map(
			(role) => roleTranslationMap[role.toLowerCase()] || role
		),
		firstname: dto.firstname,
		lastname: dto.lastname,
		imageProfile: dto.imageProfile,
		phones: dto.phones,
		email: dto.email,
		language: dto.language as EnumLanguage,
		theme: dto.theme as EnumTheme,
		platformType: dto.platformType as EnumPlatformType,
	};
};
