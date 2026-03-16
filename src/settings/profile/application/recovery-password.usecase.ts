import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type {
	IRecoveryPasswordRequest,
	IRecoveryPasswordResponse,
} from "../domain/interfaces/recovery-password.interface";
import type { IRecoveryPasswordPort } from "../domain/ports/recovery-password.port";

export class RecoveryPasswordUseCase {
	constructor(private readonly recoveryPasswordPort: IRecoveryPasswordPort) {}

	async execute(
		request: IRecoveryPasswordRequest
	): Promise<IResponse<IRecoveryPasswordResponse>> {
		return await this.recoveryPasswordPort.recoveryPassword(request);
	}
}
