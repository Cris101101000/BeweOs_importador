import { isValidUrl } from "@shared/utils/form-validations.utils";
import { EnumCatalogType } from "../domain/enums/catalog-type.enum";
import type {
	ICatalogItem,
	IUpdateCatalogItemRequest,
} from "../domain/interfaces/catalog.interface";
import type { ICatalogPort } from "../domain/ports/catalog.port";
import {
	getModifiedFields,
	hasModifiedFields,
} from "../infrastructure/utils/field-comparison.util";

export class UpdateCatalogItemUseCase {
	constructor(private catalogPort: ICatalogPort) {}

	async execute(itemData: IUpdateCatalogItemRequest): Promise<ICatalogItem> {
		try {
			console.log('itemData >>',itemData);
			// Validaciones de negocio
			this.validateItemData(itemData);

			// Get the original item to compare changes
			const originalItem = await this.catalogPort.getCatalogItemById(
				itemData.id
			);
			console.log('originalItem >>',originalItem);
			// Get only the modified fields
			const modifiedFields = getModifiedFields(originalItem, itemData);
			console.log('modifiedFields >>',modifiedFields);
			// Check if there are any changes
			if (!hasModifiedFields(modifiedFields)) {
				return originalItem;
			}

			// Create the update request with only modified fields
			const updateRequest: IUpdateCatalogItemRequest = {
				id: itemData.id,
				type: originalItem.type, // Preserve the original type
				...modifiedFields,
				...(itemData.isAiExcluded !== undefined && {
					isAiExcluded: itemData.isAiExcluded,
				}),
			};
			console.log('updateRequest >>',updateRequest);
			return await this.catalogPort.updateCatalogItem(updateRequest);
		} catch (error) {
			console.error("Error updating catalog item:", error);
			throw error;
		}
	}

	private validateItemData(itemData: IUpdateCatalogItemRequest): void {
		if (!itemData.id) {
			throw new Error("El ID del elemento es requerido");
		}

		if (itemData.name !== undefined && itemData.name.trim().length === 0) {
			throw new Error("El nombre del elemento no puede estar vacío");
		}

		if (itemData.price !== undefined && itemData.price < 0) {
			throw new Error("El precio no puede ser negativo");
		}

		// Validación de URLs externas
		if (
			itemData.externalPurchaseUrl !== undefined &&
			itemData.externalPurchaseUrl.trim() !== "" &&
			!isValidUrl(itemData.externalPurchaseUrl)
		) {
			throw new Error("El enlace de compra externa no es una URL válida");
		}

		if (
			itemData.externalUrl !== undefined &&
			itemData.externalUrl.trim() !== "" &&
			!isValidUrl(itemData.externalUrl)
		) {
			throw new Error("El enlace de reserva externa no es una URL válida");
		}

		// Validaciones específicas para servicios
		if (itemData.type === EnumCatalogType.Service) {
			if (itemData.duration !== undefined) {
				const durationValue =
					typeof itemData.duration === "string"
						? Number.parseInt(itemData.duration, 10)
						: itemData.duration;
				if (durationValue < 0) {
					throw new Error("La duración del servicio no puede ser negativa");
				}
			}
		}

		// Validaciones específicas para productos
		if (itemData.type === EnumCatalogType.Product) {
			if (
				itemData.metadata?.measureValue !== undefined &&
				typeof itemData.metadata.measureValue === "number" &&
				itemData.metadata.measureValue < 0
			) {
				throw new Error("El valor de medida no puede ser negativo");
			}
		}
	}
}
