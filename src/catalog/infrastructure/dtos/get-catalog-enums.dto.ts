export interface GetCatalogEnumsResponseDto {
	success: boolean;
	message: string;
	data: {
		categories: string[];
		units: string[];
	};
	timestamp: string;
}

export interface CatalogEnumsDto {
	categories: string[];
	units: string[];
}
