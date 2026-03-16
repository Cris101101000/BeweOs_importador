import type { Result } from "@shared/domain/errors/Result";
import type { DeleteAssetError } from "../errors/DeleteAssetError";

export interface IAssetsPort {
	deleteAsset(id: string): Promise<Result<void, DeleteAssetError>>;
}
