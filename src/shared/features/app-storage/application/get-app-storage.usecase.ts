import type { Result } from "@shared/domain/errors/Result";
import type { IAppStorageEntry } from "../domain/interfaces/app-storage.interface";
import type { IAppStorageRepository } from "../domain/ports/app-storage.port";

export class GetAppStorageUseCase {
	constructor(private readonly repository: IAppStorageRepository) {}

	async execute(
		type: string,
		scope: string
	): Promise<Result<IAppStorageEntry, Error>> {
		return await this.repository.getByType(type, scope);
	}
}
