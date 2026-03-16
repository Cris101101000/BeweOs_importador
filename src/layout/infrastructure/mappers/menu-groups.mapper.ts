import type { IGroup } from "../../domain/interfaces/modulo.interface";
import type { DtoGetUserData } from "../dtos/get-init-user.dto";

/**
 * Generates dynamic routes based on module structure.
 * - Modules without children: /{moduleId}
 * - Modules with children: Parent has no direct route, children use /{parentId}/{childName}
 * - Child IDs follow pattern: {parentId}-{childName}, extract childName for route
 */
const generateModuleRoute = (
	moduleId: string,
	hasChildren: boolean,
	parentId?: string
): string => {
	// If it's a child module, extract the child name and create parent/child route
	if (parentId) {
		const childName = moduleId.replace(`${parentId}-`, "");
		return `/${parentId}/${childName}`;
	}

	// If module has children, redirect to first child or return base route
	if (hasChildren) {
		return `/${moduleId}`;
	}

	// Simple module without children
	return `/${moduleId}`;
};

/**
 * Maps DTO groups to the IGroup domain model with dynamic route generation.
 * @param dtoGroups - The group data from the user DTO.
 * @returns An array of IGroup objects for the menu.
 */
export const mapDtoToGroups = (
	dtoGroups: DtoGetUserData["group"]
): IGroup[] => {
	return dtoGroups.map((group) => ({
		name: group.name,
		modules: group.modules.map((moduleDto) => {
			const hasChildren = Boolean(
				moduleDto.children && moduleDto.children.length > 0
			);

			return {
				id: moduleDto.id,
				name: moduleDto.name,
				icon: moduleDto.icon ?? "",
				type: moduleDto.type,
				order: moduleDto.order,
				href: generateModuleRoute(moduleDto.id, hasChildren),
				labels: moduleDto.labels,
				enabled: moduleDto.enabled,
				resources: moduleDto.resources,
				children: moduleDto.children?.map((childDto) => ({
					id: childDto.id,
					name: childDto.name,
					icon: childDto.icon ?? "",
					type: childDto.type,
					order: childDto.order,
					href: generateModuleRoute(childDto.id, false, moduleDto.id),
					labels: childDto.labels,
					enabled: childDto.enabled,
					resources: childDto.resources,
				})),
			};
		}),
	}));
};
