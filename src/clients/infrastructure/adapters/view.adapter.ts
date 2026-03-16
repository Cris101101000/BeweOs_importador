import { PAGINATION } from "@clients/domain/constants/pagination.constants";
import type {
	ICreateView,
	IView,
} from "@clients/domain/interfaces/view.interface";
import type { IViewPort } from "@clients/domain/ports/view.port";
import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type { ViewResponseDto } from "../dtos/view.dto";
import {
	toCreateViewRequestDto,
	toViewFromResponse,
} from "../mappers/view.mapper";

/**
 * ViewAdapter - Infrastructure layer adapter for view operations
 *
 * Handles communication with the backend API for saved views functionality.
 * Implements the IViewPort interface and provides fallback mock data for development.
 *
 * @example
 * ```typescript
 * const viewAdapter = new ViewAdapter();
 * const views = await viewAdapter.getViews('company-123', 'user-456');
 * ```
 */
export class ViewAdapter implements IViewPort {
	private readonly httpClient: IHttpClient = httpService;
	/**
	 * Creates a new saved view
	 *
	 * @param viewData - The view data to create
	 * @returns Promise<IView> - The created view
	 * @throws Error if creation fails
	 */
	async createView(viewData: ICreateView): Promise<IView> {
		const requestDto = toCreateViewRequestDto(viewData);

		const response = await this.httpClient.post<ViewResponseDto>(
			"/saved-views",
			requestDto
		);

		if (response.success && response.data) {
			return toViewFromResponse(response.data);
		}

		throw new Error(response.error?.code || "Failed to create view");
	}

	/**
	 * Retrieves saved views and optionally a specific user
	 *
	 * @param userId - Optional user ID to filter views
	 * @param page - Page number for pagination (default: 1)
	 * @param limit - Number of items per page (default: 20)
	 * @returns Promise<IView[]> - Array of saved views
	 * @throws Error if retrieval fails
	 */
	async getViews(page = 1, limit = PAGINATION.limit): Promise<IView[]> {
		// Construct parameters with proper values (not template literals)
		const params: Record<string, string | number> = {
			entityType: "clients", // Add required entityType parameter
			page,
			limit,
		};

		// Use the correct endpoint path
		const response = await this.httpClient.get<ViewResponseDto[]>(
			"/saved-views",
			{
				params,
			}
		);

		if (response.success && response.data) {
			return response.data.map(toViewFromResponse);
		}

		return [];
	}

	/**
	 * Retrieves a specific view by its ID
	 *
	 * @param viewId - The unique identifier of the view
	 * @returns Promise<IView> - The requested view
	 * @throws Error if view not found or retrieval fails
	 */
	async getViewById(viewId: string): Promise<IView> {
		try {
			const response = await this.httpClient.get<ViewResponseDto>(
				`/saved-views/${viewId}`
			);

			if (response.success && response.data) {
				return toViewFromResponse(response.data);
			}

			throw new Error(`View with id ${viewId} not found`);
		} catch (error) {
			console.error("Error getting view by ID:", error);
			throw new Error(`Failed to get view with ID: ${viewId}`);
		}
	}

	/**
	 * Deletes a saved view by its ID
	 *
	 * @param viewId - The unique identifier of the view to delete
	 * @returns Promise<void> - Resolves when deletion is complete
	 * @throws Error if view not found or deletion fails
	 */
	async deleteView(viewId: string): Promise<void> {
		try {
			const response = await this.httpClient.delete(`/saved-views/${viewId}`);
			console.log("response DELETE VIEW", response);

			if (response.success) {
				console.log(`View ${viewId} deleted successfully`);
				return;
			}

			throw new Error(response.error?.code || "Failed to delete view");
		} catch (error) {
			console.error("Error deleting view:", error);
			throw new Error(`Failed to delete view with ID: ${viewId}`);
		}
	}
}
