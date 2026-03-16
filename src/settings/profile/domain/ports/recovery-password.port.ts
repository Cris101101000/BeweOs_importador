import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type {
	IRecoveryPasswordRequest,
	IRecoveryPasswordResponse,
} from "../interfaces/recovery-password.interface";

export interface IRecoveryPasswordPort {
	recoveryPassword(
		request: IRecoveryPasswordRequest
	): Promise<IResponse<IRecoveryPasswordResponse>>;
}
