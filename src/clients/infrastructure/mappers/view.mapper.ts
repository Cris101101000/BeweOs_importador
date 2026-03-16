import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type {
	ICreateView,
	IView,
} from "@clients/domain/interfaces/view.interface";
import type { CreateViewRequestDto, ViewResponseDto } from "../dtos/view.dto";
import {
	toClientFilterFromRequestDto,
	toGetClientsByFilterRequestDto,
} from "./client-filter.mapper";

/**
 * Converts ICreateView to CreateViewRequestDto
 * Omits the 'order' property from filters when creating a view
 */
export const toCreateViewRequestDto = (
	view: ICreateView
): CreateViewRequestDto => {
	// Create a copy of filters without the order property using destructuring
	const { order, ...filtersWithoutOrder } = view.filters;

	return {
		name: view.name,
		description: view.description,
		entityType: view.entityType || "clients",
		filterConfig: toGetClientsByFilterRequestDto(
			filtersWithoutOrder as IClientFilter
		),
		isDefault: view.isDefault,
	};
};

/**
 * Converts ViewResponseDto to IView
 */
export const toViewFromResponse = (dto: ViewResponseDto): IView => ({
	id: dto.id,
	name: dto.name,
	description: dto.description,
	filters: toClientFilterFromRequestDto(dto.filterConfig),
	companyId: dto.companyId,
	userId: dto.userId,
	createdAt: new Date(dto.createdAt),
	updatedAt: new Date(dto.updatedAt),
	isDefault: dto.isDefault,
	isActive: dto.isActive,
	entityType: dto.entityType,
});
