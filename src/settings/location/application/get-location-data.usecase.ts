import type { ICity } from "../domain/interfaces/country.interface";
import type { ICountry } from "../domain/interfaces/country.interface";
import type { ILocationDataPort } from "../domain/ports/location-data.port";

/**
 * Use case for getting location data (countries and cities).
 */
export class GetLocationDataUseCase {
	constructor(private readonly locationDataPort: ILocationDataPort) {}

	/**
	 * Gets all available countries.
	 * @returns Promise with array of countries
	 */
	async getCountries(): Promise<ICountry[]> {
		return this.locationDataPort.getCountries();
	}

	/**
	 * Gets cities for a specific country.
	 * @param countryCode - ISO 3166-1 alpha-2 country code
	 * @returns Promise with array of cities for the country
	 */
	async getCitiesByCountry(countryCode: string): Promise<ICity[]> {
		return this.locationDataPort.getCitiesByCountry(countryCode);
	}
}
