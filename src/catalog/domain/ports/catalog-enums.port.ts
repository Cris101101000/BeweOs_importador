export interface CatalogEnumsDto {
	categories: string[];
	units: string[];
}

export interface ICatalogEnumsPort {
	getCatalogEnums(): Promise<CatalogEnumsDto>;
}
