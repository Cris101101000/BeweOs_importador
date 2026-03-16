import type { ICatalogPort } from "../domain/ports/catalog.port";

export class DeleteCatalogManyItemsUseCase {
	constructor(private catalogPort: ICatalogPort) {}

	async execute(ids: string[]): Promise<void> {
		try {
			if (!ids || ids.length === 0) {
				throw new Error("Se requiere al menos un ID para eliminar");
			}

			await this.catalogPort.deleteCatalogManyItems(ids);
		} catch (error) {
			throw error;
		}
	}
}
