import type { ICatalogPort } from "../domain/ports/catalog.port";

export class DeleteCatalogItemUseCase {
	constructor(private catalogPort: ICatalogPort) {}

	async execute(id: string): Promise<void> {
		try {
			if (!id) {
				throw new Error("El ID del elemento es requerido");
			}

			// Verificar que el elemento existe antes de eliminarlo
			await this.catalogPort.getCatalogItemById(id);

			await this.catalogPort.deleteCatalogItem(id);
		} catch (error) {
			throw error;
		}
	}
}
