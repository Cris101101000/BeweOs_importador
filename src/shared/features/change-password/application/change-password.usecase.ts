import type { Result } from "@shared/domain/errors/Result";
import type { IChangePasswordRequest } from "../domain/interfaces/change-password.interface";
import type { IChangePasswordRepository } from "../domain/ports/change-password.port";

export class ChangePasswordUseCase {
	constructor(private readonly repository: IChangePasswordRepository) {}

	async execute(
		request: IChangePasswordRequest
	): Promise<Result<void, Error>> {
		return await this.repository.changePassword(request);
	}
}
