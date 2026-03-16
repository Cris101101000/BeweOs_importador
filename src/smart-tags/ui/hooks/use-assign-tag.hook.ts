import { useCallback, useState } from "react";
import { AssignTagUseCase } from "../../application/assign-tag.usecase";
import type { ApplicableEntity } from "../../domain/enums/applicable-entity.enum";
import { AssignmentSmartTagAdapter } from "../../infrastructure/adapters/assignment-smart-tags.adapter";
import { getApiValueFromEntity } from "../../infrastructure/utils/applicable-entity.util";

const assignmentRepository = new AssignmentSmartTagAdapter();
const assignTagUseCase = new AssignTagUseCase(assignmentRepository);

/**
 * Hook for assigning tags to entities
 */
export const useAssignTag = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const assignTag = useCallback(
		async (
			tagId: string,
			entityType: ApplicableEntity,
			entityIds: string[]
		) => {
			setIsLoading(true);
			setError(null);

			try {
				const apiEntityType = getApiValueFromEntity(entityType);

				if (!apiEntityType) {
					throw new Error(`Invalid entity type: ${entityType}`);
				}

				await assignTagUseCase.assignTagToMultiple(
					tagId,
					apiEntityType,
					entityIds
				);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error assigning tag";
				setError(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		assignTag,
		isLoading,
		error,
	};
};
