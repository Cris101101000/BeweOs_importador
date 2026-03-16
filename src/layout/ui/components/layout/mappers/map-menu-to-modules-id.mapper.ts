import type {
	IMenu,
	IModulo,
} from "../../../../domain/interfaces/modulo.interface";

const getModuleIds = (modules: IModulo[]): string[] => {
	let ids: string[] = [];
	for (const module of modules) {
		ids.push(module.id);
		if (module.children) {
			ids = [...ids, ...getModuleIds(module.children)];
		}
	}
	return ids;
};

export const mapMenuToModuleIds = (menu: IMenu): string[] => {
	if (!menu.groups) {
		return [];
	}

	let moduleIds: string[] = [];
	for (const group of menu.groups) {
		moduleIds = [...moduleIds, ...getModuleIds(group.modules)];
	}

	return moduleIds;
};
