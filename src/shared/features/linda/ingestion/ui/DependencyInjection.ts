import { DeleteAssetUseCase } from "../application/delete-asset.usecase";
import { GetFilesUseCase } from "../application/get-files.usecase";
import { GetScrapedUrlsUseCase } from "../application/get-scraped-urls.usecase";
import { GetTrainingStatusUseCase } from "../application/get-training-status.usecase";
import { RetriveUrlUseCase } from "../application/retrive-url.usecase";
import { StartTrainingUseCase } from "../application/start-training.usecase";
import { UploadFilesUseCase } from "../application/upload-files.usecase";
import { AssetsAdapter } from "../infrastructure/adapters/assets.adapter";
import { FilesAdapter } from "../infrastructure/adapters/files.adapter";
import { TrainingAdapter } from "../infrastructure/adapters/training.adapter";
import { UrlsAdapter } from "../infrastructure/adapters/urls.adapter";

const assetsRepository = new AssetsAdapter();
const filesRepository = new FilesAdapter();
const urlsRepository = new UrlsAdapter();
const trainingRepository = new TrainingAdapter();

export const UploadFiles = (files: File[]) => {
	const uploadFilesUseCase = new UploadFilesUseCase(filesRepository);
	return uploadFilesUseCase.execute(files);
};

export const GetFiles = () => {
	const getFilesUseCase = new GetFilesUseCase(filesRepository);
	return getFilesUseCase.execute();
};

export const DeleteAsset = (id: string) => {
	const deleteAssetUseCase = new DeleteAssetUseCase(assetsRepository);
	return deleteAssetUseCase.execute(id);
};

export const RetriveUrl = (url: string) => {
	const retriveUrlUseCase = new RetriveUrlUseCase(urlsRepository);
	return retriveUrlUseCase.execute(url);
};

export const StartTraining = (urls: string[]) => {
	const startTrainingUseCase = new StartTrainingUseCase(trainingRepository);
	return startTrainingUseCase.execute(urls);
};

export const GetTrainingStatus = () => {
	const getTrainingStatusUseCase = new GetTrainingStatusUseCase(
		trainingRepository
	);
	return getTrainingStatusUseCase.execute();
};

export const GetScrapedUrls = () => {
	const getScrapedUrlsUseCase = new GetScrapedUrlsUseCase(urlsRepository);
	return getScrapedUrlsUseCase.execute();
};
