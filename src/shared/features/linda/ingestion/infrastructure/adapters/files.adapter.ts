import { Result } from "@shared/domain/errors/Result";
import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import { GetFilesError } from "../../domain/errors/GetFilesError";
import { UploadFilesError } from "../../domain/errors/UploadFilesError";
import type { IFile } from "../../domain/interfaces/files";
import type { IFilesPort } from "../../domain/ports/files.port";
import type { AssetsResponseDto } from "../dtos/assets-response.dto";
import { FilesMapper } from "../mappers/files.mapper";

export class FilesAdapter implements IFilesPort {
	private readonly httpClient: IHttpClient = httpService;

	async getFiles(): Promise<Result<IFile[], GetFilesError>> {
		const response = await this.httpClient.get<AssetsResponseDto>(
			"assets?contexts=linda_clients&contexts=archive"
		);

		if (response.success && response.data) {
			return Result.Ok(FilesMapper.toDomainList(response.data.assets));
		}

		return Result.Err(
			new GetFilesError(response.error?.message || "Failed to get files")
		);
	}

	async uploadFiles(files: File[]): Promise<Result<IFile[], UploadFilesError>> {
		const formData = new FormData();

		for (const file of files) {
			formData.append("files", file);
		}

		formData.append("prefix", "linda");
		formData.append("contexts", "linda_clients");
		formData.append("contexts", "archive");

		const response = await this.httpClient.post<AssetsResponseDto>(
			"assets/upload-files",
			formData
		);

		if (response.success && response.data) {
			return Result.Ok(
				FilesMapper.toDomainList(response.data.assets?.successfulAssets || [])
			);
		}

		return Result.Err(
			new UploadFilesError(response.error?.message || "Failed to upload files")
		);
	}
}
