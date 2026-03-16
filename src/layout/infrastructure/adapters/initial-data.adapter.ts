import { getUserId } from "@beweco/utils-js";
import { type IHttpClient, httpService } from "@http";
import { mapDtoToAgency } from "src/layout/infrastructure/mappers/agency.mapper";
import { mapDtoToGroups } from "src/layout/infrastructure/mappers/menu-groups.mapper";
import { mapDtoToNews } from "src/layout/infrastructure/mappers/news.mapper";
import { mapDtoToUser } from "src/layout/infrastructure/mappers/user.mapper";
import type { IAgency } from "../../domain/interfaces/agency.interface";
import type { IInitialData } from "../../domain/interfaces/initial-data.interface";
import type { IMenu } from "../../domain/interfaces/modulo.interface";
import type { IUser } from "../../domain/interfaces/user.interface";
import type { IAgencyPort } from "../../domain/ports/agency.port";
import type { IClientManifestPort } from "../../domain/ports/client-manifest.port";
import type { IInitialDataPort } from "../../domain/ports/initial-data.port";
import type { IMenuModulesPort } from "../../domain/ports/menu-modules.port";
import type { IUserPort } from "../../domain/ports/user.port";
import type { DtoGetUserData } from "../dtos/get-init-user.dto";
import { mockInitialDataResponse } from "../mocks/initial-data-response.mock";

/**
 * Adapter for fetching initial application data.
 * This class implements multiple ports and acts as a single source of truth
 * for initial data, caching the raw response to avoid redundant API calls.
 */
export class InitialDataAdapter
	implements
		IInitialDataPort,
		IUserPort,
		IAgencyPort,
		IMenuModulesPort,
		IClientManifestPort
{
	private readonly httpClient: IHttpClient = httpService;
	private cachedData: DtoGetUserData | null = null;
	private fetchPromise: Promise<DtoGetUserData> | null = null;

	/**
	 * Fetches the initial data from the API and caches it.
	 * If the data is already cached, it returns the cached data directly.
	 * This method is the core of the caching strategy.
	 * @private
	 * @returns {Promise<DtoGetUserData>} The raw data from the API.
	 */
	private async fetchAndCacheData(): Promise<DtoGetUserData> {
		// Si ya hay datos en caché, devolverlos inmediatamente
		if (this.cachedData) {
			return this.cachedData;
		}

		// Si ya hay una petición en curso, reutilizar la misma promesa
		if (this.fetchPromise) {
			return this.fetchPromise;
		}

		this.fetchPromise = (async () => {
			const response = await this.httpClient.get(`/users/${getUserId()}/me`);

			if (response.success && response.data) {
				return response.data;
			}
			throw new Error(response.message || "Failed to fetch initial data");
		})();

		try {
			const data = await this.fetchPromise;
			this.cachedData = data;
			return data;
		} finally {
			// Limpiar la promesa en vuelo, éxito o error
			this.fetchPromise = null;
		}
	}

	/**
	 * Retrieves the complete initial data set, mapped to the domain model.
	 * @returns {Promise<IInitialData>} The fully mapped initial data.
	 */
	async getInitialData(): Promise<IInitialData> {
		const data = await this.fetchAndCacheData();
		return {
			user: mapDtoToUser(data.user),
			agency: mapDtoToAgency(data.agency),
			modulos: mapDtoToGroups(data.group).flatMap((g) => g.modules), // Aplanar para la estructura antigua si es necesario
			news: mapDtoToNews(data.news),
		};
	}

	/**
	 * Retrieves user-specific data, mapped to the IUser domain model.
	 * @returns {Promise<IUser | null>} The mapped user data.
	 */
	async getUser(): Promise<IUser | null> {
		const data = await this.fetchAndCacheData();
		return mapDtoToUser(data.user);
	}

	/**
	 * Retrieves agency-specific data, mapped to the IAgency domain model.
	 * @returns {Promise<IAgency | null>} The mapped agency data.
	 */
	async getAgency(): Promise<IAgency | null> {
		// const data = await this.fetchAndCacheData();
		// TODO: Remove this once the API is implemented
		const data = mockInitialDataResponse?.data;
		return mapDtoToAgency(data?.agency || ({} as any));
	}

	/**
	 * Retrieves the client manifest primary key from the initial data.
	 * @returns {Promise<string | null>} The client manifest PK or null if not available.
	 */
	async getClientManifestPk(): Promise<string | null> {
		const data = await this.fetchAndCacheData();
		console.log("data client manifest pk", data);
		return data?.clientManifestPk || null;
	}

	/**
	 * Retrieves all data required for the menu, including modules and news,
	 * mapped to the IMenu domain model.
	 * @returns {Promise<IMenu | null>} The mapped menu data.
	 */
	async getMenuModules(): Promise<IMenu | null> {
		const data = await this.fetchAndCacheData();
		// TODO: Remove this once the API is implemented
		// const data = mockInitialDataResponse?.data;
		return {
			groups: mapDtoToGroups(data?.group || []),
			news: mapDtoToNews(data?.news || [])[0],
		};
	}
}
