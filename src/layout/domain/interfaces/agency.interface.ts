import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import type { IConfigurations } from "./configuration.interface";

export interface IBrandConfig {
	id: string;
	brandName: string;
	platformName: string;
	primaryColors: string[];
	secondaryColors: string[];
	logo: string | null;
	favicon: string | null;
	accessDomain: {
		url: string | null;
		verificationStatus: string;
	};
	communicationDomain: {
		url: string | null;
		verificationStatus: string;
	};
	createdAt: string;
	updatedAt: string;
	createdBy: string;
}

export interface IAgency {
	id: string;
	name: string;
	logo: string;
	configurations: IConfigurations;
	// Extended fields from API
	type?: string;
	state?: string;
	country?: string;
	language?: string | null;
	currency?: string | null;
	timezone?: string | null;
	terms?: string | null;
	policies?: string | null;
	description?: string | null;
	urlGoogleBusiness?: string | null;
	webPage?: string | null;
	phones?: IPhone[];
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
	brandConfig?: IBrandConfig;
}
