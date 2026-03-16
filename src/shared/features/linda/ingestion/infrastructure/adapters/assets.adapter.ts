import { Result } from "@shared/domain/errors/Result";
import { type IHttpClient, httpService } from "@shared/infrastructure/services";
import { DeleteAssetError } from "../../domain/errors/DeleteAssetError";
import type { IAssetsPort } from "../../domain/ports/assets.port";

export class AssetsAdapter implements IAssetsPort {
	private readonly httpClient: IHttpClient = httpService;

	async deleteAsset(id: string): Promise<Result<void, DeleteAssetError>> {
		const response = await this.httpClient.delete<void>(`assets/${id}`);

		if (response.success) {
			return Result.Ok(undefined);
		}

		return Result.Err(
			new DeleteAssetError(response.error?.message || "Failed to delete asset")
		);
	}
}
