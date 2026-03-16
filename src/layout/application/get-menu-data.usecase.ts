import type { IMenu } from "../domain/interfaces/modulo.interface";
import type { IMenuModulesPort } from "../domain/ports/menu-modules.port";

/**
 * Use case to get all the necessary data for the menu, including modules and news.
 */
export class GetMenuDataUseCase {
	constructor(private readonly menuModulesPort: IMenuModulesPort) {}

	async execute(): Promise<IMenu | null> {
		return await this.menuModulesPort.getMenuModules();
	}
}
