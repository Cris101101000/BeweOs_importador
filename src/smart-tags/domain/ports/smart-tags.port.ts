import type { SmartTagsFilters } from "../../infrastructure/adapters/smart-tags.adapter.ts";
import type {
	ISmartTag,
	ISmartTagsPaginatedResponse,
} from "../interfaces/smart-tags-interface.ts";

export interface ISmartTagPort {
	// Smart Tags Management
	getSmartTags(
		filters?: SmartTagsFilters
	): Promise<ISmartTagsPaginatedResponse>;
	getSmartTagById(id: string): Promise<ISmartTag | null>;
	createSmartTag(
		tag: Omit<ISmartTag, "id" | "createdAt" | "updatedAt">
	): Promise<ISmartTag>;
	updateSmartTag(id: string, updates: Partial<ISmartTag>): Promise<ISmartTag>;
	deleteSmartTag(id: string): Promise<void>;
	deleteSmartTags(ids: string[]): Promise<void>;
}
