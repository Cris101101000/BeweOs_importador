import type { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import type { EnumGender } from "@shared/domain/enums/enum-gender.enum";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";
import type { EnumBusinessCategory } from "../enums/business-category.enum";

import type { IAddress } from "@clients/domain/interfaces/address.interface";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { IPotential } from "./potential.interface";
import type { IStatus } from "./status.interface";

export interface IClient {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	phones: IPhone[];
	createdBy?: string;
	status: IStatus;
	tags?: IAiTag[];
	createdAt?: string;
	updatedAt?: string;
	avatarUrl?: string;
	bussines?: string;
	category?: EnumBusinessCategory;
	birthdate?: string;
	createdChannel?: EnumCreationChannel;
	potential?: IPotential;
	lastCommunication?: string;
	isActive?: boolean;
	gender?: EnumGender;
	address?: IAddress;
	formattedAddress?: string;
}

export interface IFastClient {
	firstName: string;
	lastName: string;
	email: string;
	phone: IPhone;
}

export interface IClientResponse {
	clients: IClient[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
