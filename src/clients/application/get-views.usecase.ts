import { PAGINATION } from "@clients/domain/constants/pagination.constants";
import type { IView } from "../domain/interfaces/view.interface";
import type { IViewPort } from "../domain/ports/view.port";

/**
 * Use case for retrieving client views
 */
export class GetViewsUseCase {
	constructor(private readonly viewPort: IViewPort) {}

	/**
	 * Executes the use case to retrieve views
	 * @param userId - The ID of the user (optional, to filter by user)
	 * @param page - Current page (optional, defaults to 1)
	 * @param limit - Items per page (optional, defaults to 20)
	 * @returns Promise<IView[]> - List of views
	 */
	async execute(page = 1, limit = PAGINATION.limit): Promise<IView[]> {
		return await this.viewPort.getViews(page, limit);
	}
}
