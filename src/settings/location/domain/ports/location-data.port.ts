import type { ICity } from "../interfaces/country.interface";
import type { ICountry } from "../interfaces/country.interface";

/**
 * Port for location data operations (countries and cities).
 */
export interface ILocationDataPort {
	/**
	 * Gets all available countries.
	 * @returns Promise with array of countries
	 */
	getCountries(): Promise<ICountry[]>;

	/**
	 * Gets cities for a specific country.
	 * @param countryCode - ISO 3166-1 alpha-2 country code
	 * @returns Promise with array of cities for the country
	 */
	getCitiesByCountry(countryCode: string): Promise<ICity[]>;
}
