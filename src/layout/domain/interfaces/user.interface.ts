import type { EnumLanguage } from "../../../shared/domain/enums/enum-language.enum";
import type { EnumTheme } from "../../../shared/domain/enums/enum-theme.enum";
import type { IPhone } from "../../../shared/domain/interfaces/phone.interface";
import type { EnumPlatformType } from "../enums/enum-platform-type.enum";

export interface IUser {
	id?: string;
	isAdmin: boolean;
	roles: string[];
	firstname: string;
	lastname?: string;
	imageProfile?: string;
	phones?: IPhone[];
	email: string;
	language: EnumLanguage;
	theme: EnumTheme;
	platformType?: EnumPlatformType;
}
