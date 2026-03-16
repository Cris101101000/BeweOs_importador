import type { IBusinessVerticalRepository } from "src/onboarding/domain/business-vertical/ports/business-vertical.port";
import { httpService } from "@shared/infrastructure/services/api-http.service";
import { Result } from "@shared/domain/errors/Result";

export class BusinessVerticalAdapter implements IBusinessVerticalRepository {
	async getVerticals(): Promise<Result<string[], Error>> {
		try {
			const response = await httpService.get<string[]>("/companies/verticals");

			if (!response.success || !response.data) {
				return Result.Err(
					new Error(response.message || "Error al obtener las verticales"),
				);
			}

			return Result.Ok(response.data);
		} catch (error) {
			return Result.Err(
				error instanceof Error ? error : new Error("Error inesperado"),
			);
		}
	}

	async saveVertical(vertical: string): Promise<Result<void, Error>> {
		try {
			const response = await httpService.put("/companies/verticals", {
				vertical,
			});

			if (!response.success) {
				return Result.Err(
					new Error(response.message || "Error al guardar la vertical"),
				);
			}

			return Result.Ok();
		} catch (error) {
			return Result.Err(
				error instanceof Error ? error : new Error("Error inesperado"),
			);
		}
	}
}
