import type { IMenu } from "../interfaces/modulo.interface";

/**
 * Port for menu modules.
 */
export interface IMenuModulesPort {
	getMenuModules(): Promise<IMenu | null>;
}
