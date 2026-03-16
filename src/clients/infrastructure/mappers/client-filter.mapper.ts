import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";

import type { EnumOrder } from "@clients/domain/enums/order.enum";
import type { EnumPotentialClient } from "@clients/domain/enums/potential.enum";
import type { GetClientsByFilterRequestDto } from "../dtos/get-clients-by-filter.dto";

export const toGetClientsByFilterRequestDto = (
	filters: IClientFilter
): GetClientsByFilterRequestDto => {
	// Helper function to check if array has values
	const hasValues = (arr?: unknown[]): arr is unknown[] =>
		Array.isArray(arr) && arr.length > 0;

	// Helper function to check if string has content
	const hasContent = (str?: string): str is string =>
		typeof str === "string" && str.trim().length > 0;

	// Build request DTO with only defined values using object spread and conditional properties
	const base: Record<string, unknown> = {
		// Array filters - only if they have elements
		...(hasValues(filters.status) && { status: filters.status }),
		...(hasValues(filters.potential) && { potentialTier: filters.potential }),
		...(hasValues(filters.tags) && { tags: filters.tags }),

		// Date filters - only if dates exist
		...(filters.createdDateFrom && {
			createdFrom: filters.createdDateFrom.toISOString(),
		}),
		...(filters.createdDateTo && {
			createdTo: filters.createdDateTo.toISOString(),
		}),
		...(filters.birthdateFrom && {
			birthdateFrom: filters.birthdateFrom.toISOString(),
		}),
		...(filters.birthdateTo && {
			birthdateTo: filters.birthdateTo.toISOString(),
		}),
		...(filters.lastCommunicationFrom && {
			lastCommunicationFrom: filters.lastCommunicationFrom.toISOString(),
		}),
		...(filters.lastCommunicationTo && {
			lastCommunicationTo: filters.lastCommunicationTo.toISOString(),
		}),

		// String filters - only if they have content
		...(hasContent(filters.search) && { search: filters.search.trim() }),
		...(hasContent(filters.order) && { order: filters.order }),

		// Numeric filters - only if they are defined (including 0)
		...(filters.limit !== undefined && { limit: filters.limit }),
		...(filters.offset !== undefined && { offset: filters.offset }),
	} as Record<string, unknown>;

	return base as GetClientsByFilterRequestDto;
};

/**
 * Converts GetClientsByFilterRequestDto to IClientFilter
 * This is the inverse mapper for converting DTO back to domain interface
 */
export const toClientFilterFromRequestDto = (
	dto: GetClientsByFilterRequestDto
): IClientFilter => {
	const filter: IClientFilter = {};

	// Array filters
	if (dto.status?.length) filter.status = dto.status;
	if (dto.potentialTier?.length)
		filter.potential = dto.potentialTier as EnumPotentialClient[];
	if (dto.tags?.length) filter.tags = dto.tags;

	// Date filters - convert ISO strings back to Date objects
	if (dto.createdFrom) filter.createdDateFrom = new Date(dto.createdFrom);
	if (dto.createdTo) filter.createdDateTo = new Date(dto.createdTo);
	if (dto.birthdateFrom) filter.birthdateFrom = new Date(dto.birthdateFrom);
	if (dto.birthdateTo) filter.birthdateTo = new Date(dto.birthdateTo);
	if (dto.lastCommunicationFrom)
		filter.lastCommunicationFrom = new Date(dto.lastCommunicationFrom);
	if (dto.lastCommunicationTo)
		filter.lastCommunicationTo = new Date(dto.lastCommunicationTo);

	// String filters
	if (dto.search) filter.search = dto.search;
	if (dto.order) filter.order = dto.order as EnumOrder;

	// Numeric filters
	if (dto.limit !== undefined) filter.limit = dto.limit;
	if (dto.offset !== undefined) filter.offset = dto.offset;

	return filter;
};
