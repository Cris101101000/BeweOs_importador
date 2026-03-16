import { useEffect, useMemo, useState } from "react";
import { GetLocationDataUseCase } from "../../application/get-location-data.usecase";
import type { ICity } from "../../domain/interfaces/country.interface";
import type { ICountry } from "../../domain/interfaces/country.interface";
import { LocationDataAdapter } from "../../infrastructure/adapters/location-data.adapter";

/**
 * Custom hook to manage location data (countries and cities).
 *
 * @param selectedCountryCode - Optional country code to filter cities
 * @returns Object with countries, cities, loading state, and error
 */
export const useLocationData = (selectedCountryCode?: string) => {
	const [countries, setCountries] = useState<ICountry[]>([]);
	const [cities, setCities] = useState<ICity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Load countries on mount
	useEffect(() => {
		const loadCountries = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const adapter = new LocationDataAdapter();
				const useCase = new GetLocationDataUseCase(adapter);
				const countriesData = await useCase.getCountries();
				setCountries(countriesData);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error loading countries"
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadCountries();
	}, []);

	// Load cities when country is selected
	useEffect(() => {
		const loadCities = async () => {
			if (!selectedCountryCode) {
				setCities([]);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);
				const adapter = new LocationDataAdapter();
				const useCase = new GetLocationDataUseCase(adapter);
				const citiesData =
					await useCase.getCitiesByCountry(selectedCountryCode);
				setCities(citiesData);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error loading cities");
				setCities([]);
			} finally {
				setIsLoading(false);
			}
		};

		loadCities();
	}, [selectedCountryCode]);

	// Transform countries to format expected by Select component
	const countriesOptions = useMemo(
		() =>
			countries.map((country) => ({
				key: country.code.toLowerCase(),
				label: country.name,
			})),
		[countries]
	);

	// Transform cities to format expected by Select component
	const citiesOptions = useMemo(
		() =>
			cities.map((city) => ({
				key: city.code,
				label: city.name,
			})),
		[cities]
	);

	return {
		countries: countriesOptions,
		cities: citiesOptions,
		isLoading,
		error,
	};
};
