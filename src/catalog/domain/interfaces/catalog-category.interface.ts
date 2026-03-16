import type { EnumCatalogType } from "../enums/catalog-type.enum";

export interface ICatalogCategory {
	id: string;
	name: string;
	description?: string;
	color?: string;
	type: EnumCatalogType;
	createdAt: Date;
	updatedAt: Date;
}
