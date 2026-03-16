import type { ICreateView, IView } from "../domain/interfaces/view.interface";
import type { IViewPort } from "../domain/ports/view.port";

/**
 * Use case for creating a new client view
 */
export class CreateViewUseCase {
	constructor(private readonly viewPort: IViewPort) {}

	/**
	 * Executes the use case to create a view
	 * @param viewData - Data for the view to be created
	 * @returns Promise<IView> - Created view
	 */
	async execute(viewData: ICreateView): Promise<IView> {
		// Ensure entityType is always "clients"
		const viewDataWithEntity: ICreateView = {
			...viewData,
			entityType: "clients",
			description: viewData.description || "",
		};

		const createdView = await this.viewPort.createView(viewDataWithEntity);
		return createdView;
	}
}
