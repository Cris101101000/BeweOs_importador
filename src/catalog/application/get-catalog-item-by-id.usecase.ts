import type { ICatalogItem } from "../domain/interfaces/catalog.interface";
import type { ICatalogPort } from "../domain/ports/catalog.port";

export class GetCatalogItemByIdUseCase {
	constructor(private catalogPort: ICatalogPort) {}

	async execute(id: string): Promise<ICatalogItem> {
		try {
			if (!id) {
				throw new Error("El ID del elemento es requerido");
			}

			return await this.catalogPort.getCatalogItemById(id);
		} catch (error) {
			console.error("Error fetching catalog item by ID:", error);
			throw error;
		}
	}
}
