export class DeleteAssetError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DELETE_ASSET_ERROR";
	}
}
