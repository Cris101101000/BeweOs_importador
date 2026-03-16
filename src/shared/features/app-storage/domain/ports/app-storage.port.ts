import type { Result } from "@shared/domain/errors/Result";
import type { IAppStorageEntry } from "../interfaces/app-storage.interface";

export interface IAppStorageRepository {
	getByType(
		type: string,
		scope: string
	): Promise<Result<IAppStorageEntry, Error>>;
	save(entry: IAppStorageEntry): Promise<Result<void, Error>>;
}
