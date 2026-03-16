import type { Result } from "@shared/domain/errors/Result";
import type { GetFilesError } from "../errors/GetFilesError";
import type { UploadFilesError } from "../errors/UploadFilesError";
import type { IFile } from "../interfaces/files";

export interface IFilesPort {
	uploadFiles(files: File[]): Promise<Result<IFile[], UploadFilesError>>;
	getFiles(): Promise<Result<IFile[], GetFilesError>>;
}
