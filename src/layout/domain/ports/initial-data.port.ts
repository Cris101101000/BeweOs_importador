import type { IInitialData } from "../interfaces/initial-data.interface";

export interface IInitialDataPort {
	getInitialData(): Promise<IInitialData>;
}
