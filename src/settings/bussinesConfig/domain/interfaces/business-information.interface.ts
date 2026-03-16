import type { IHoliday } from "@settings/schedules/domain/interfaces/holiday.interface";
import type { ICurrency } from "@shared/domain/interfaces/currency.interface";
import type { ContactType } from "../enums/contact-type.enum";
import type { ISchedule } from "./schedule.interface";

export interface IBusinessInformation {
	basicInfo: IBasicInformation;
	businessInfo: IBusinessInfo;
	brandConfig: IBrandConfig;
	contactInfo: IContactInfo;
	schedule: ISchedule;
	holidays: IHoliday[];
	systemConfiguration?: ISystemConfiguration;
}

export interface ISystemConfiguration {
	terms?: string;
}

export interface IBasicInformation {
	name: string;
	webDomain?: string;
}

export interface IBusinessInfo {
	vertical: string;
	taxInfo?: {
		nit?: string;
	};
	currency: ICurrency;
}

export interface IBrandConfig {
	brandName: string;
	logo: string;
	favicon: string;
	description: string;
	slogan: string;
	primaryColor?: string;
	secondaryColor?: string;
}

export interface IPhoneContact {
	id?: string;
	code: string;
	country: string;
	number: string;
	type: ContactType;
	isVisible: boolean;
	channels?: ("phone" | "whatsapp")[];
}

export interface IEmailContact {
	id?: string;
	email: string;
	type: ContactType;
	isVisible: boolean;
	createdBy: string;
}

export interface ISocialNetwork {
	instagram?: string;
	facebook?: string;
	tiktok?: string;
	twitter?: string;
	linkedin?: string;
	youtube?: string;
}

export interface IAddress {
	address?: string;
	urlGoogleMaps?: string;
	country?: string;
	city?: string;
	zip?: string;
}

export interface IContactInfo {
	phones?: IPhoneContact[];
	emails?: IEmailContact[];
	socialNetwork?: ISocialNetwork;
	address?: IAddress;
	phonesWhatsapp?: IPhoneContact[];
}
