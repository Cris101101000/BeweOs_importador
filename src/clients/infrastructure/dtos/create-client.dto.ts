import type { AiTagDto } from "@clients/infrastructure/dtos/ai-tag.dto";
import type { PhoneDto } from "@shared/infrastructure/dtos/phone.dto";

export interface CreateClientRequestDto {
	firstname: string;
	lastname: string;
	phones: PhoneDto[];
	email: string;
	business?: string;
	category?: string;
	birthdate?: string; // 'dd/mm/yyyy'
	status: string;
	creationChannel: string;
	tags?: AiTagDto[];
	gender?: string;
}

export interface CreateClientResponseDto {
	id: string;
	firstname: string;
	lastname: string;
	phone: PhoneDto[];
	email: string;
	birthdate?: string; // 'dd/mm/yyyy'
	status: string;
}
