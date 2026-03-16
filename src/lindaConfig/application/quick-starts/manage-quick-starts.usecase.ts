import type { QuickStart } from "../../domain/quick-starts/interfaces";
import type { IQuickStartsPort } from "../../domain/quick-starts/ports";

export class ManageQuickStartsUseCase {
	constructor(private readonly quickStartsRepository: IQuickStartsPort) {}

	async getQuickStarts(): Promise<QuickStart[]> {
		return await this.quickStartsRepository.getQuickStarts();
	}

	async createQuickStart(
		quickStart: Omit<QuickStart, "id" | "createdAt">
	): Promise<QuickStart> {
		return await this.quickStartsRepository.createQuickStart(
			quickStart as QuickStart
		);
	}

	async updateQuickStart(
		id: string,
		quickStart: Partial<QuickStart>
	): Promise<QuickStart> {
		return await this.quickStartsRepository.updateQuickStart(
			id,
			quickStart as QuickStart
		);
	}

	async deleteQuickStart(id: string): Promise<void> {
		return await this.quickStartsRepository.deleteQuickStart(id);
	}

	async toggleQuickStartActive(
		id: string,
		isActive: boolean
	): Promise<QuickStart> {
		return await this.quickStartsRepository.updateQuickStart(id, {
			isActive,
		} as QuickStart);
	}
}
