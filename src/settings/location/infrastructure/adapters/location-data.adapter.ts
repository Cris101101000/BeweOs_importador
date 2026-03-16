import type { ICity } from "../../domain/interfaces/country.interface";
import type { ICountry } from "../../domain/interfaces/country.interface";
import type { ILocationDataPort } from "../../domain/ports/location-data.port";
import { CITIES_DATA, COUNTRIES_DATA } from "../data/countries-cities.data";

/**
 * Adapter for location data operations (countries and cities).
 * Currently uses static data, but can be extended to use an API.
 */
export class LocationDataAdapter implements ILocationDataPort {
	async getCountries(): Promise<ICountry[]> {
		// Simulate async operation
		return Promise.resolve(COUNTRIES_DATA);
	}

	async getCitiesByCountry(countryCode: string): Promise<ICity[]> {
		// Normalize country code to uppercase
		const normalizedCode = countryCode.toUpperCase();
		const cities = CITIES_DATA[normalizedCode] || [];

		// Simulate async operation
		return Promise.resolve(cities);
	}
}
