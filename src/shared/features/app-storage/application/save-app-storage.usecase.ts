import type { Result } from "@shared/domain/errors/Result";
import type { IAppStorageEntry } from "../domain/interfaces/app-storage.interface";
import type { IAppStorageRepository } from "../domain/ports/app-storage.port";

export class SaveAppStorageUseCase {
	constructor(private readonly repository: IAppStorageRepository) {}

	async execute(entry: IAppStorageEntry): Promise<Result<void, Error>> {
		return await this.repository.save(entry);
	}
}
