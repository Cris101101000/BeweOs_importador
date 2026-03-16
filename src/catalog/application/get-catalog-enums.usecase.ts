import type {
	CatalogEnumsDto,
	ICatalogEnumsPort,
} from "../domain/ports/catalog-enums.port";

/*
 * GetCatalogEnumsUseCase - Use case for getting catalog enums (categories and units)
 * Works for both products and services
 */
export class GetCatalogEnumsUseCase {
	constructor(private readonly catalogEnumsPort: ICatalogEnumsPort) {}
	async execute(): Promise<CatalogEnumsDto> {
		return await this.catalogEnumsPort.getCatalogEnums();
	}
}
