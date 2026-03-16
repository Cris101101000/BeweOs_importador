import { GetAppStorageUseCase } from "../application/get-app-storage.usecase";
import { SaveAppStorageUseCase } from "../application/save-app-storage.usecase";
import type { IAppStorageEntry } from "../domain/interfaces/app-storage.interface";
import { AppStorageAdapter } from "../infrastructure/adapters/app-storage.adapter";

const appStorageRepository = new AppStorageAdapter();

export const GetAppStorage = (type: string, scope: string) => {
	const useCase = new GetAppStorageUseCase(appStorageRepository);
	return useCase.execute(type, scope);
};

export const SaveAppStorage = (entry: IAppStorageEntry) => {
	const useCase = new SaveAppStorageUseCase(appStorageRepository);
	return useCase.execute(entry);
};
