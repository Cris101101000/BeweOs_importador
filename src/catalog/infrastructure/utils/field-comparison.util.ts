import type {
	ICatalogItem,
	IUpdateCatalogItemRequest,
} from "../../domain/interfaces/catalog.interface";

/**
 * Utility function to detect which fields have been modified between original and updated data
 */
export const getModifiedFields = (
	original: ICatalogItem,
	updated: IUpdateCatalogItemRequest
): Partial<ICatalogItem> => {
	const modifiedFields: Partial<ICatalogItem> = {};

	// Check basic fields
	if (updated.name !== undefined && updated.name !== original.name) {
		modifiedFields.name = updated.name;
	}

	if (
		updated.description !== undefined &&
		updated.description !== original.description
	) {
		modifiedFields.description = updated.description;
	}

	if (
		updated.categoryId !== undefined &&
		updated.categoryId !== original.categoryId
	) {
		modifiedFields.categoryId = updated.categoryId;
	}

	if (updated.price !== undefined && updated.price !== original.price) {
		modifiedFields.price = updated.price;
	}

	if (updated.status !== undefined && updated.status !== original.status) {
		modifiedFields.status = updated.status;
	}

	if (updated.type !== undefined && updated.type !== original.type) {
		modifiedFields.type = updated.type;
	}

	// Check metadata fields
	if (updated.metadata) {
		const modifiedMetadata: any = {};
		let hasMetadataChanges = false;

		// Check each metadata field
		Object.keys(updated.metadata).forEach((key) => {
			const originalValue = original.metadata?.[key];
			const updatedValue = updated.metadata?.[key];

			if (updatedValue !== undefined && updatedValue !== originalValue) {
				modifiedMetadata[key] = updatedValue;
				hasMetadataChanges = true;
			}
		});

		// Only include metadata if there are changes
		if (hasMetadataChanges) {
			modifiedFields.metadata = {
				...original.metadata,
				...modifiedMetadata,
			};
		}
	}

	// Check other fields
	if (updated.pdfUrl !== undefined && updated.pdfUrl !== original.pdfUrl) {
		modifiedFields.pdfUrl = updated.pdfUrl;
	}

	if (updated.pdfName !== undefined && updated.pdfName !== original.pdfName) {
		modifiedFields.pdfName = updated.pdfName;
	}

	if (
		updated.images !== undefined &&
		JSON.stringify(updated.images) !== JSON.stringify(original.images)
	) {
		modifiedFields.images = updated.images;
	}

	if (
		updated.tags !== undefined &&
		JSON.stringify(updated.tags) !== JSON.stringify(original.tags)
	) {
		modifiedFields.tags = updated.tags;
	}

	// Check duration field (specific for services)
	if (updated.duration !== undefined) {
		const originalFormattedDuration = original.metadata?.formattedDuration;
		if (updated.duration !== originalFormattedDuration) {
			const durationValue =
				typeof updated.duration === "string"
					? Number.parseInt(updated.duration, 10)
					: updated.duration;
			modifiedFields.duration = durationValue;
		}
	}

	// Check isAiExcluded field
	if (updated.isAiExcluded !== undefined) {
		const originalExcludeFromAI =
			(original.metadata?.excludeFromAI as boolean) ?? false;
		if (updated.isAiExcluded !== originalExcludeFromAI) {
			// Add isAiExcluded to the modified fields
			(modifiedFields as any).isAiExcluded = updated.isAiExcluded;
		}
	}

	// Check externalPurchaseUrl field
	if (
		updated.externalPurchaseUrl !== undefined &&
		updated.externalPurchaseUrl !== original.externalPurchaseUrl
	) {
		(modifiedFields as any).externalPurchaseUrl = updated.externalPurchaseUrl;
	}

	// Check externalUrl field
	if (updated.externalUrl !== undefined && updated.externalUrl !== original.externalUrl) {
		(modifiedFields as any).externalUrl = updated.externalUrl;
	}

	return modifiedFields;
};

/**
 * Check if there are any modified fields
 */
export const hasModifiedFields = (
	modifiedFields: Partial<ICatalogItem>
): boolean => {
	return Object.keys(modifiedFields).length > 0;
};
