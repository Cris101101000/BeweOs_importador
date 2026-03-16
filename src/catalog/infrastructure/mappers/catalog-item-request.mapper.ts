import { EnumCatalogStatus } from "@catalog/domain/enums/catalog-status.enum";
import { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import { EnumMeasureUnit } from "@catalog/domain/enums/measure-unit.enum";
import { EnumServiceMeasureUnit } from "@catalog/domain/enums/service-measure-unit.enum";
import type {
	ICreateCatalogItemRequest,
	IUpdateCatalogItemRequest,
} from "@catalog/domain/interfaces/catalog.interface";
import type {
	CreateCatalogItemRequestDto,
	UpdateCatalogItemRequestDto,
} from "../dtos/get-catalog-item.dto";
import { parseDuration } from "../utils/duration-parser.util";

/**
 * Maps Spanish enum values to English API format
 */
const mapProductUnitToApi = (unit: string): string => {
	const unitLower = unit.toLowerCase();
	const mapping: Record<string, string> = {
		kilogramo: "kilograms",
		gramo: "grams",
		mililitro: "milliliters",
		litro: "liters",
		onza: "ounces",
		unidad: "units",
		centimetro: "centimeters",
		metro: "meters",
	};
	return mapping[unitLower] || unit; // Return as-is if already in English or unknown
};

const mapServiceUnitToApi = (unit: string): string => {
	const unitLower = unit.toLowerCase();
	const mapping: Record<string, string> = {
		hora: "hours",
		minuto: "minutes",
		dia: "days",
		semana: "weeks",
		mes: "months",
		ano: "years",
	};
	return mapping[unitLower] || unit; // Return as-is if already in English or unknown
};

/**
 * Maps domain ICreateCatalogItemRequest to API CreateCatalogItemRequestDto
 */
export function toCreateCatalogItemRequestDto(
	itemData: ICreateCatalogItemRequest
): CreateCatalogItemRequestDto {
	// Validate required fields
	if (!itemData.name?.trim()) {
		throw new Error("Name is required");
	}
	if (!itemData.categoryId?.trim()) {
		throw new Error("Category ID is required");
	}
	if (itemData.price < 0) {
		throw new Error("Price cannot be negative");
	}

	// Extract measure data from metadata - different logic for products vs services
	let measureUnit: string;
	let measureValue: number;

	if (itemData.type === EnumCatalogType.Service) {
		console.log("itemData.duration", itemData.duration);
		// For services, parse duration text if provided
		if (itemData.duration && typeof itemData.duration === "string") {
			const parsedDuration = parseDuration(itemData.duration);
			measureUnit = mapServiceUnitToApi(parsedDuration.unit);
			measureValue = parsedDuration.value;
		} else if (itemData.duration && typeof itemData.duration === "number") {
			// If duration is a number, treat it as minutes
			measureUnit = "minutes"; // Use English API format
			measureValue = itemData.duration;
		} else {
			// Use metadata values or defaults for services
			const rawUnit =
				(itemData.metadata?.measureUnit as string) ||
				EnumServiceMeasureUnit.Minuto;
			measureUnit = mapServiceUnitToApi(rawUnit);
			measureValue = (itemData.metadata?.measureValue as number) || 1;
		}
	} else {
		// For products, use product measure units
		const rawUnit =
			(itemData.metadata?.measureUnit as string) || EnumMeasureUnit.Unidad;
		measureUnit = mapProductUnitToApi(rawUnit);
		measureValue = (itemData.metadata?.measureValue as number) || 1;
	}

	return {
		name: itemData.name.trim(),
		description: itemData.description?.trim() || "",
		category: itemData.categoryId,
		basePrice: itemData.price,
		tax: 0, // Default tax, could be calculated or passed
		measureUnit: measureUnit, // Use value from metadata
		measureValue: measureValue, // Use value from metadata
		brand: (itemData.metadata?.brand as string) || "", // Use brand from metadata
		sku: "", // Default empty SKU
		isEnabled: itemData.status === EnumCatalogStatus.Active || true, // Use enum value comparison
		duration:
			typeof itemData.duration === "string"
				? parseDuration(itemData.duration).value
				: itemData.duration, // Only relevant for services
		externalPurchaseUrl: itemData.externalPurchaseUrl || "",
		externalUrl: itemData.externalUrl || "",
	};
}

/**
 * Maps domain IUpdateCatalogItemRequest to API UpdateCatalogItemRequestDto
 */
export function toUpdateCatalogItemRequestDto(
	itemData: IUpdateCatalogItemRequest
): UpdateCatalogItemRequestDto {
	const dto: UpdateCatalogItemRequestDto = {};

	// Basic fields
	if (itemData.name !== undefined) dto.name = itemData.name;
	if (itemData.description !== undefined)
		dto.description = itemData.description;
	if (itemData.categoryId !== undefined) dto.category = itemData.categoryId;
	if (itemData.price !== undefined) dto.basePrice = itemData.price;
	if (itemData.status !== undefined)
		dto.isEnabled = itemData.status === EnumCatalogStatus.Active;
	if (itemData.duration !== undefined) {
		dto.duration =
			typeof itemData.duration === "string"
				? parseDuration(itemData.duration).value
				: itemData.duration;
	}
	if (itemData.isAiExcluded !== undefined)
		dto.isAiExcluded = itemData.isAiExcluded;
	if (itemData.externalPurchaseUrl !== undefined)
		dto.externalPurchaseUrl = itemData.externalPurchaseUrl;
	if (itemData.externalUrl !== undefined)
		dto.externalUrl = itemData.externalUrl;

	// Handle measure data from metadata - only if metadata is being updated
	if (itemData.metadata !== undefined) {
		let measureUnit: string | undefined;
		let measureValue: number | undefined;

		if (itemData.type === EnumCatalogType.Service) {
			// For services, prioritize metadata values if they exist, otherwise parse duration
			if (
				itemData.metadata.measureUnit !== undefined &&
				itemData.metadata.measureValue !== undefined
			) {
				// Use metadata values for services (these come from the parsed duration)
				measureUnit = mapServiceUnitToApi(
					itemData.metadata.measureUnit as string
				);
				measureValue = itemData.metadata.measureValue as number;
			} else if (itemData.duration && typeof itemData.duration === "string") {
				// Fallback: parse duration text if provided
				const parsedDuration = parseDuration(itemData.duration);
				measureUnit = mapServiceUnitToApi(parsedDuration.unit);
				measureValue = parsedDuration.value;
			} else if (itemData.duration && typeof itemData.duration === "number") {
				// If duration is a number, treat it as minutes
				measureUnit = "minutes"; // Use English API format
				measureValue = itemData.duration;
			}
		} else {
			// For products, use product measure units
			if (itemData.metadata.measureUnit !== undefined) {
				measureUnit = mapProductUnitToApi(
					itemData.metadata.measureUnit as string
				);
			}
			if (itemData.metadata.measureValue !== undefined) {
				measureValue = itemData.metadata.measureValue as number;
			}
		}

		// Add measure fields if they were determined
		if (measureUnit !== undefined) dto.measureUnit = measureUnit;
		if (measureValue !== undefined) dto.measureValue = measureValue;

		// Add brand and sku if they exist in metadata
		if (itemData.metadata.brand !== undefined)
			dto.brand = itemData.metadata.brand as string;
		if (itemData.metadata.sku !== undefined)
			dto.sku = itemData.metadata.sku as string;
	}

	console.log(`Mapped updateDto for ${itemData.type}:`, dto);
	return dto;
}
