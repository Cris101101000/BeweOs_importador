import type { Result } from "@shared/domain/errors/Result";
import type { IChangePasswordRequest } from "../interfaces/change-password.interface";

export interface IChangePasswordRepository {
	changePassword(
		request: IChangePasswordRequest
	): Promise<Result<void, Error>>;
}
