import type { IView } from "../domain/interfaces/view.interface";
import type { IViewPort } from "../domain/ports/view.port";

/**
 * Use case for retrieving a view by its ID
 */
export class GetViewByIdUseCase {
	constructor(private readonly viewPort: IViewPort) {}

	/**
	 * Executes the use case to retrieve a view by its ID
	 * @param viewId - The ID of the view to retrieve
	 * @returns Promise<IView> - The found view
	 */
	async execute(viewId: string): Promise<IView> {
		return await this.viewPort.getViewById(viewId);
	}
}
