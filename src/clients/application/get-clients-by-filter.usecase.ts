import { PAGINATION } from "@clients/domain/constants/pagination.constants";
import type { IClientFilter } from "../domain/interfaces/client-filter.interface";
import type { IClientResponse } from "../domain/interfaces/client.interface";
import type { IClientPort } from "../domain/ports/client.port";

export class GetClientsByFilterUseCase {
	constructor(private readonly clientPort: IClientPort) {}

	async execute(filters?: IClientFilter): Promise<IClientResponse> {
		// Set default pagination if not provided
		const defaultFilters: IClientFilter = {
			...PAGINATION, // Order by created date descending by default
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
				"createdAt",
				"name",
				"email",
				"status",
				"category",
				"birthdate",
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

		// Validate date ranges
		if (defaultFilters.createdDateFrom && defaultFilters.createdDateTo) {
			if (defaultFilters.createdDateFrom > defaultFilters.createdDateTo) {
				throw new Error("Created date 'from' cannot be later than 'to'");
			}
		}

		if (defaultFilters.birthdateFrom && defaultFilters.birthdateTo) {
			if (defaultFilters.birthdateFrom > defaultFilters.birthdateTo) {
				throw new Error("Birthdate 'from' cannot be later than 'to'");
			}
		}

		return await this.clientPort.getClientsByFilters(defaultFilters);
	}
}
