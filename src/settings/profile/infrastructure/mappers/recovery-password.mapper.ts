import type {
	IRecoveryPasswordRequest,
	IRecoveryPasswordResponse,
} from "../../domain/interfaces/recovery-password.interface";
import type {
	DtoRecoveryPasswordRequest,
	DtoRecoveryPasswordResponse,
} from "../dtos/recovery-password.dto";

export const mapDomainToDto = (
	domain: IRecoveryPasswordRequest
): DtoRecoveryPasswordRequest => {
	return {
		userId: domain.userId,
	};
};

export const mapDtoToDomain = (
	dto: DtoRecoveryPasswordResponse
): IRecoveryPasswordResponse => {
	return {
		message: dto.message,
		timestamp: dto.timestamp,
	};
};
