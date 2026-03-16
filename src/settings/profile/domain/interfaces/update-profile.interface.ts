import type { EnumLanguage } from "@shared/domain/enums/enum-language.enum";
import type { EnumTheme } from "@shared/domain/enums/enum-theme.enum";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";

export interface IUpdateProfileRequest {
	firstname?: string;
	lastname?: string;
	phones?: IPhone[];
	language?: EnumLanguage;
	theme?: EnumTheme;
	imageProfile?: string;
}

export interface IUpdateProfileResponse {
	id: string;
	firstname: string;
	lastname?: string;
	phones: IPhone[];
	language: EnumLanguage;
	theme: EnumTheme;
}
