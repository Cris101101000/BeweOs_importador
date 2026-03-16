import { ChangePasswordUseCase } from "../application/change-password.usecase";
import type { IChangePasswordRequest } from "../domain/interfaces/change-password.interface";
import { ChangePasswordAdapter } from "../infrastructure/adapters/change-password.adapter";

const repository = new ChangePasswordAdapter();

export const ChangePassword = (request: IChangePasswordRequest) =>
	new ChangePasswordUseCase(repository).execute(request);
