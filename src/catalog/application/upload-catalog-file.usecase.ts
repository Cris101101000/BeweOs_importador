import type { ICatalogPort } from "../domain/ports/catalog.port";

/**
 * Use case for uploading files to catalog items (products or services)
 */
export class UploadCatalogFileUseCase {
	constructor(private readonly catalogPort: ICatalogPort) {}

	async execute(file: File, entityId: string): Promise<string> {
		return await this.catalogPort.uploadFile(file, entityId);
	}
}
