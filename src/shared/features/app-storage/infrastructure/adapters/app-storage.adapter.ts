import { Result } from "@shared/domain/errors/Result";
import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import type { IAppStorageEntry } from "../../domain/interfaces/app-storage.interface";
import type { IAppStorageRepository } from "../../domain/ports/app-storage.port";
import type {
	AppStorageResponseDto,
	AppStorageUpsertRequestDto,
} from "../dtos/app-storage.dto";

export class AppStorageAdapter implements IAppStorageRepository {
	private readonly httpClient: IHttpClient = httpService;

	async getByType(
		type: string,
		scope: string
	): Promise<Result<IAppStorageEntry, Error>> {
		try {
			const response = await this.httpClient.get<AppStorageResponseDto>(
				`/app-storage/${type}`,
				{ params: { scope } }
			);

			if (!response) {
				return Result.Err(new Error("No se pudo conectar con el servidor."));
			}

			if (response.success && response.data) {
				const entry: IAppStorageEntry = {
					type: response.data.type,
					scope,
					value: response.data.value,
				};
				return Result.Ok(entry);
			}

			return Result.Err(
				new Error(
					response.error?.message || "Error al obtener el almacenamiento."
				)
			);
		} catch (error) {
			return Result.Err(
				error instanceof Error
					? error
					: new Error("Error inesperado al obtener el almacenamiento.")
			);
		}
	}

	async save(entry: IAppStorageEntry): Promise<Result<void, Error>> {
		try {
			const requestDto: AppStorageUpsertRequestDto = {
				type: entry.type,
				scope: entry.scope,
				value: entry.value,
			};

			const response = await this.httpClient.put("/app-storage", requestDto);

			if (!response) {
				return Result.Err(new Error("No se pudo conectar con el servidor."));
			}

			if (!response.success) {
				return Result.Err(
					new Error(
						response.error?.message || "Error al guardar el almacenamiento."
					)
				);
			}

			return Result.Ok();
		} catch (error) {
			return Result.Err(
				error instanceof Error
					? error
					: new Error("Error inesperado al guardar el almacenamiento.")
			);
		}
	}
}
