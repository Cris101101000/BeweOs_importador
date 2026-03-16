import { PAGINATION } from "../domain/constants/pagination.constants";
import type { ICatalogFilters } from "../domain/interfaces/catalog-filter.interface";
import type { ICatalogResponse } from "../domain/interfaces/catalog.interface";
import type { ICatalogPort } from "../domain/ports/catalog.port";

export class GetCatalogItemsUseCase {
	constructor(private catalogPort: ICatalogPort) {}

	async execute(
		filters?: ICatalogFilters | Record<string, any>
	): Promise<ICatalogResponse> {
		try {
			// Set default pagination if not provided
			const defaultFilters: ICatalogFilters = {
				...PAGINATION,
				...filters,
			};

			// Validate pagination parameters
			if (defaultFilters.offset !== undefined && defaultFilters.offset < 0) {
				throw new Error("Offset must be greater than or equal to 0");
			}

			if (
				defaultFilters.limit &&
				(defaultFilters.limit < 1 || defaultFilters.limit > 100)
			) {
				throw new Error("Limit must be between 1 and 100");
			}

			// Validate order parameter (basic validation)
			if (defaultFilters.order) {
				const validOrderFields = [
					"name",
					"price",
					"createdAt",
					"updatedAt",
					"isEnabled",
					"categories",
				];
				const orderField = defaultFilters.order.startsWith("-")
					? defaultFilters.order.substring(1)
					: defaultFilters.order;

				if (!validOrderFields.includes(orderField)) {
					throw new Error(
						`Invalid order field: ${orderField}. Valid fields: ${validOrderFields.join(", ")}`
					);
				}
			}

			return await this.catalogPort.getCatalogItems(defaultFilters);
		} catch (error) {
			console.error("Error fetching catalog items:", error);
			throw error;
		}
	}
}
