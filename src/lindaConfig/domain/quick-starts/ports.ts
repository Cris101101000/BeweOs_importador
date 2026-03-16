import type { QuickStart } from "./interfaces";

export interface IQuickStartsPort {
	getQuickStarts(): Promise<QuickStart[]>;
	createQuickStart(quickStart: QuickStart): Promise<QuickStart>;
	updateQuickStart(
		id: string,
		quickStart: Partial<QuickStart>
	): Promise<QuickStart>;
	deleteQuickStart(id: string): Promise<void>;
}
