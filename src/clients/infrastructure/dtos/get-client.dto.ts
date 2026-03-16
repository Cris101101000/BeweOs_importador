import type { AiTagDto } from "@clients/infrastructure/dtos/ai-tag.dto";
import type { PhoneDto } from "@shared/infrastructure/dtos/phone.dto";

export interface GetClientResponseDto {
	id?: string;
	companyId?: string;
	// Name fields - API can return either name or firstname/lastname
	firstname?: string;
	lastname?: string;
	formattedName?: string;
	email?: string;
	createdBy?: string;
	birthdate?: string; // ISO string format
	lastCommunication?: string;
	potentialTier?: string;
	potentialScore?: number;
	status?: string;
	initials?: string;
	emailDomain?: string;
	isCorporateEmail?: boolean;
	isActive?: boolean;
	phones?: PhoneDto[];
	address?: AddressDto;
	hasWhatsApp?: boolean;
	hasCompleteAddress?: boolean;
	formattedAddress?: string;
	createdAt?: string;
	updatedAt?: string;
	gender?: string;
	creationChannel?: string;
	tags?: AiTagDto[];
	notes?: NoteDto[];
}

export interface AddressDto {
	id?: string;
	address?: string;
	urlGoogleMaps?: string;
	country?: string;
	city?: string;
	zip?: string;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Response DTO that matches the API Gateway response structure
 * API returns { items: [...], total: number }
 */
export interface GetClientsResponseDto {
	items: GetClientResponseDto[];
	total: number;
}

export interface NoteDto {
	id?: string;
	content?: string;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
}
