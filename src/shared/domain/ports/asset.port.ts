import type {
	ICreateAssetsRequest,
	ICreateAssetsResponse,
} from "../interfaces/asset.interface";

/**
 * Asset Port - Domain interface for asset operations
 */
export interface IAssetPort {
	/**
	 * Create multiple assets in the backend
	 * @param request - The create assets request
	 * @returns Promise with created assets response
	 */
	createAssets(request: ICreateAssetsRequest): Promise<ICreateAssetsResponse>;
}
