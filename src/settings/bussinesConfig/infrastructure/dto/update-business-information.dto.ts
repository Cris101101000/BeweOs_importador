import type { IPhone } from "src/shared/domain/interfaces/phone.interface";

export interface IUpdateBusinessInformationDto {
	basicInfo?: {
		name?: string;
		webDomain?: string;
		taxInfo?: {
			nit?: string;
		};
	};
	businessInfo?: {
		vertical?: string;
		taxInfo?: {
			nit?: string;
		};
	};
	systemConfiguration?: {
		terms?: string;
		currency?: string;
	};
	contactInfo?: {
		phones?: {
			code: string;
			country: string;
			number: string;
			type: string;
			isVisible: boolean;
			channels?: string[];
		}[];
		emails?: {
			email: string;
			type: string;
			isVisible: boolean;
			createdBy?: string;
		}[];
		address?: {
			address?: string;
			urlGoogleMaps?: string;
			country?: string;
			city?: string;
			zip?: string;
		};
		socialNetwork?: {
			instagram?: string;
			facebook?: string;
			tiktok?: string;
			twitter?: string;
			linkedin?: string;
			youtube?: string;
		};
	};
	brandConfig?: {
		brandName?: string;
		primaryColor?: string[];
		secondaryColor?: string[];
		logo?: string;
		favicon?: string;
		description?: string;
		slogan?: string;
		accessDomain?: {
			url?: string;
		};
		communicationDomain?: {
			url?: string;
		};
	};
	// Backward compatibility fields (to be deprecated if not used by backend)
	name?: string;
	webPage?: string;
	description?: string;
}
