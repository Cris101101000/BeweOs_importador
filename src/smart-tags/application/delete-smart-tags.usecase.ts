import type { ISmartTagPort } from "../domain/ports/smart-tags.port.ts";

/**
 * DeleteSmartTagsUseCase - Use case for deleting multiple smart tags
 *
 * This use case handles the deletion of multiple smart tags by their IDs.
 * It validates input parameters and delegates the deletion to the smart tag port.
 */
export class DeleteSmartTagsUseCase {
	constructor(private readonly smartTagPort: ISmartTagPort) {}

	/**
	 * Executes the deletion of multiple smart tags
	 *
	 * @param ids - Array of smart tag IDs to delete
	 * @returns Promise that resolves when all tags are deleted
	 * @throws Error if ids is empty or contains invalid IDs
	 */
	async execute(ids: string[]): Promise<void> {
		if (!ids || ids.length === 0) {
			throw new Error("At least one tag ID is required");
		}

		// Validate that all IDs are non-empty strings
		const invalidIds = ids.filter((id) => !id || typeof id !== "string");
		if (invalidIds.length > 0) {
			throw new Error(`Invalid tag IDs found: ${invalidIds.join(", ")}`);
		}

		await this.smartTagPort.deleteSmartTags(ids);
	}
}
