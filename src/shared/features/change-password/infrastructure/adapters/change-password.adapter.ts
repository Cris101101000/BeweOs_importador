import { Result } from "@shared/domain/errors/Result";
import { httpService } from "@shared/infrastructure/services/api-http.service";
import type { IChangePasswordRequest } from "../../domain/interfaces/change-password.interface";
import type { IChangePasswordRepository } from "../../domain/ports/change-password.port";

export class ChangePasswordAdapter implements IChangePasswordRepository {
	async changePassword(
		request: IChangePasswordRequest
	): Promise<Result<void, Error>> {
		try {
			const response = await httpService.put("/users/change-password", {
				password: request.password,
			});

			if (!response.success) {
				return Result.Err(
					new Error(
						response.message || "Error al cambiar la contraseña"
					)
				);
			}

			return Result.Ok();
		} catch (error) {
			return Result.Err(
				error instanceof Error
					? error
					: new Error("Error inesperado al cambiar la contraseña")
			);
		}
	}
}
