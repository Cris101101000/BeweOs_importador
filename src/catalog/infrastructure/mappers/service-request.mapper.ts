import { EnumCatalogStatus } from "@catalog/domain/enums/catalog-status.enum";
import { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import type {
	ICreateCatalogItemRequest,
	IUpdateCatalogItemRequest,
} from "@catalog/domain/interfaces/catalog.interface";
import type {
	CreateServiceRequestDto,
	UpdateServiceRequestDto,
} from "../dtos/get-service.dto";
import { parseDurationToApi } from "../utils/duration-formatter.util";

/**
 * Maps Spanish service unit values to English API format
 */
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
 * Maps ICreateCatalogItemRequest to CreateServiceRequestDto
 * Services always have type = "service"
 * Calculates tax as equal to basePrice (tax = basePrice, totalPrice = basePrice + tax)
 */
export const toCreateServiceRequestDto = (
	request: ICreateCatalogItemRequest
): CreateServiceRequestDto => {
	// For services, the price includes tax, so we need to calculate basePrice and tax
	// If tax = basePrice, then totalPrice = basePrice + tax = 2 * basePrice
	// So basePrice = totalPrice / 2, tax = basePrice
	const totalPrice = request.price;
	const basePrice = Math.round(totalPrice / 2);
	const tax = basePrice; // tax equals basePrice as per requirement

	// Parse duration from text to get measureValue and measureUnit
	const durationText = (request.metadata?.durationText as string) || "";
	const { measureValue, measureUnit } = parseDurationToApi(durationText);

	return {
		name: request.name,
		...(request.description && { description: request.description }),
		basePrice: basePrice,
		tax: tax,
		measureUnit: mapServiceUnitToApi(measureUnit), // Convert to English API format
		measureValue: measureValue,
		category: request.categoryId, // Map categoryId to category string
		isEnabled: request.status === EnumCatalogStatus.Active,
	};
};

/**
 * Maps IUpdateCatalogItemRequest to UpdateServiceRequestDto
 * Calculates tax as equal to basePrice when price is provided
 */
export const toUpdateServiceRequestDto = (
	request: IUpdateCatalogItemRequest
): UpdateServiceRequestDto => {
	const result: UpdateServiceRequestDto = {
		...(request.name && { name: request.name }),
		...(request.description && { description: request.description }),
		...(request.categoryId && { category: request.categoryId }),
		...(request.status !== undefined && {
			isEnabled: request.status === EnumCatalogStatus.Active,
		}),
	};

	// Handle duration if provided
	if (request.metadata?.durationText) {
		const durationText = request.metadata.durationText as string;
		const { measureValue, measureUnit } = parseDurationToApi(durationText);
		result.measureUnit = mapServiceUnitToApi(measureUnit); // Convert to English API format
		result.measureValue = measureValue;
	} else if (request.duration !== undefined) {
		// Fallback to old behavior if duration is provided as number
		result.measureUnit = "minutes"; // Use English API format
		result.measureValue = request.duration;
	}

	// Calculate basePrice and tax if price is provided
	if (request.price !== undefined) {
		const totalPrice = request.price;
		const basePrice = Math.round(totalPrice / 2);
		const tax = basePrice; // tax equals basePrice as per requirement

		result.basePrice = basePrice;
		result.tax = tax;
	}

	return result;
};

/**
 * Maps CreateServiceRequestDto to ICreateCatalogItemRequest
 * Services always have type = EnumCatalogType.Service
 * Calculates total price from basePrice + tax
 */
export const toCreateCatalogItemRequestFromServiceDto = (
	dto: CreateServiceRequestDto
): ICreateCatalogItemRequest => {
	const totalPrice = dto.basePrice + dto.tax;

	return {
		name: dto.name,
		...(dto.description && { description: dto.description }),
		price: totalPrice,
		currency: "COP", // Default currency
		categoryId: dto.category,
		type: EnumCatalogType.Service, // Services always have this type
		status: dto.isEnabled
			? EnumCatalogStatus.Active
			: EnumCatalogStatus.Inactive,
		duration: dto.measureValue,
	};
};
