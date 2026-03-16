import type {
	ICatalogItem,
	ICreateCatalogItemRequest,
} from "../domain/interfaces/catalog.interface";
import type { ICatalogPort } from "../domain/ports/catalog.port";

export class CreateCatalogItemUseCase {
	constructor(private catalogPort: ICatalogPort) {}

	async execute(itemData: ICreateCatalogItemRequest): Promise<ICatalogItem> {
		try {
			// Validaciones de negocio
			this.validateItemData(itemData);

			return await this.catalogPort.createCatalogItem(itemData);
		} catch (error) {
			console.error("Error creating catalog item:", error);
			throw error;
		}
	}

	private validateItemData(itemData: ICreateCatalogItemRequest): void {
		if (!itemData.name || itemData.name.trim().length === 0) {
			throw new Error("El nombre del elemento es requerido");
		}

		if (itemData.price < 0) {
			throw new Error("El precio no puede ser negativo");
		}

		if (!itemData.categoryId) {
			throw new Error("La categoría es requerida");
		}
	}
}
