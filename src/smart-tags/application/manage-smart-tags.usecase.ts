import type {
	ISmartTag,
	ISmartTagsPaginatedResponse,
} from "../domain/interfaces/smart-tags-interface.ts";
import type { ISmartTagPort } from "../domain/ports/smart-tags.port.ts";
import type { SmartTagsFilters } from "../infrastructure/adapters/smart-tags.adapter.ts";

export class ManageSmartTagsUseCase {
	constructor(private smartTagRepository: ISmartTagPort) {}

	async getSmartTags(
		filters?: SmartTagsFilters
	): Promise<ISmartTagsPaginatedResponse> {
		return this.smartTagRepository.getSmartTags(filters);
	}

	async getSmartTagById(id: string): Promise<ISmartTag | null> {
		if (!id) {
			throw new Error("Tag ID is required");
		}
		return this.smartTagRepository.getSmartTagById(id);
	}

	async createSmartTag(
		tag: Omit<ISmartTag, "id" | "createdAt" | "updatedAt">
	): Promise<ISmartTag> {
		// Validate required fields
		if (!tag.name.trim()) {
			throw new Error("Tag name is required");
		}

		if (!tag.description.trim()) {
			throw new Error("Tag description is required");
		}

		if (!tag.keywords || tag.keywords.length === 0) {
			throw new Error("At least one keyword is required");
		}

		return this.smartTagRepository.createSmartTag(tag);
	}

	async updateSmartTag(
		id: string,
		updates: Partial<ISmartTag>
	): Promise<ISmartTag> {
		const existingTag = await this.smartTagRepository.getSmartTagById(id);
		if (!existingTag) {
			throw new Error("Smart tag not found");
		}

		// Validate updates if provided
		if (updates.name !== undefined && !updates.name.trim()) {
			throw new Error("Tag name cannot be empty");
		}

		if (updates.description !== undefined && !updates.description.trim()) {
			throw new Error("Tag description cannot be empty");
		}

		if (
			updates.keywords !== undefined &&
			(!updates.keywords || updates.keywords.length === 0)
		) {
			throw new Error("At least one keyword is required");
		}

		return this.smartTagRepository.updateSmartTag(id, updates);
	}

	async deleteSmartTag(id: string): Promise<void> {
		if (!id) {
			throw new Error("Tag ID is required");
		}

		console.log(`🚀 USE CASE: Deleting smart tag with id:`, id);
		await this.smartTagRepository.deleteSmartTag(id);
		console.log(`✅ USE CASE: Smart tag deleted successfully`);
	}
}
