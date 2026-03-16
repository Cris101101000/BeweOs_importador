import type { Result } from "@shared/domain/errors/Result";
import type { GetFilesError } from "../domain/errors/GetFilesError";
import type { IFile } from "../domain/interfaces/files";
import type { IFilesPort } from "../domain/ports/files.port";

export class GetFilesUseCase {
	constructor(private readonly filesPort: IFilesPort) {}

	async execute(): Promise<Result<IFile[], GetFilesError>> {
		return await this.filesPort.getFiles();
	}
}
