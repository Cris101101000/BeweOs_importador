import type { Result } from "@shared/domain/errors/Result";
import type { UploadFilesError } from "../domain/errors/UploadFilesError";
import type { IFile } from "../domain/interfaces/files";
import type { IFilesPort } from "../domain/ports/files.port";

export class UploadFilesUseCase {
	constructor(private readonly filesPort: IFilesPort) {}

	async execute(files: File[]): Promise<Result<IFile[], UploadFilesError>> {
		return await this.filesPort.uploadFiles(files);
	}
}
