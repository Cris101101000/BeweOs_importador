import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type { IPhone } from "../../../shared/domain/interfaces/phone.interface";

interface DtoBrandConfig {
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

interface DtoAgency {
	id: string;
	name: string;
	logo: string;
	configuration: {
		primaryColor: string[];
		secondaryColor: string[];
	};
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
	brandConfig?: DtoBrandConfig;
}

interface DtoModule {
	id: string;
	name: string;
	icon?: string;
	type: string;
	order: number;
	labels: {
		id: string;
		title: string;
		color: string;
	}[];
	enabled: boolean;
	resources: string[];
	children?: DtoModule[];
}

interface DtoGroup {
	name: string;
	modules: DtoModule[];
}

interface DtoUser {
	id?: string;
	isAdmin: boolean;
	roles: string[];
	firstname: string;
	lastname?: string;
	imageProfile: string;
	phones: IPhone[];
	email: string;
	language: string;
	theme: string;
	platformType: string;
}

interface Subscription {
	id: string;
	plan: string;
	status: string;
	endDate: string;
}

interface DtoNews {
	title: string;
	description: string;
	action: {
		type: string;
		value: string;
		label: string;
	};
}

interface DtoPermissions {
	[resource: string]: ("read" | "create" | "update" | "delete")[];
}

export interface DtoGetUserData {
	agency: DtoAgency;
	clientManifestPk: string;
	group: DtoGroup[];
	permissions: DtoPermissions[];
	user: DtoUser;
	subscription: Subscription;
	news: DtoNews[];
}

export type GetUserOutput = IResponse<DtoGetUserData>;
