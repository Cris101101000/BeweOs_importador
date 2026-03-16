import type { Result } from "@shared/domain/errors/Result";
import type { DeleteAssetError } from "../domain/errors/DeleteAssetError";
import type { IAssetsPort } from "../domain/ports/assets.port";

export class DeleteAssetUseCase {
	constructor(private readonly assetsPort: IAssetsPort) {}

	async execute(id: string): Promise<Result<void, DeleteAssetError>> {
		return await this.assetsPort.deleteAsset(id);
	}
}
