/**
 * Interface representing a country.
 */
export interface ICountry {
	/** ISO 3166-1 alpha-2 country code (e.g., "CO", "US", "ES") */
	code: string;
	/** Country name */
	name: string;
}

/**
 * Interface representing a city.
 */
export interface ICity {
	/** City identifier or code */
	code: string;
	/** City name */
	name: string;
	/** Country code this city belongs to */
	countryCode: string;
}
