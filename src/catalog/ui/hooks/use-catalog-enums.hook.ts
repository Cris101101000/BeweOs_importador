import { GetCatalogEnumsUseCase } from "@catalog/application/get-catalog-enums.usecase";
import { CatalogEnumsAdapter } from "@catalog/infrastructure/adapters/catalog-enums.adapter";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseCatalogEnumsResponse {
	categories: string[];
	units: string[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * React hook that provides catalog enums (categories and units) with built-in error handling
 * Works for both products and services
 */
export const useCatalogEnums = (): UseCatalogEnumsResponse => {
	const { t } = useTranslate();
	const [categories, setCategories] = useState<string[]>([]);
	const [units, setUnits] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Initialize the use case with the adapter
	const catalogEnumsUseCase = useMemo(() => {
		const adapter = new CatalogEnumsAdapter();
		return new GetCatalogEnumsUseCase(adapter);
	}, []);

	// Function to fetch enums
	const fetchEnums = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Add timeout to prevent hanging
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Request timeout")), 10000)
			);

			const enums = (await Promise.race([
				catalogEnumsUseCase.execute(),
				timeoutPromise,
			])) as any;

			setCategories(enums.categories);
			setUnits(enums.units);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: t("error_loading_enums", "Error cargando enums");
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [catalogEnumsUseCase, t]);

	// Refetch function
	const refetch = useCallback(async () => {
		await fetchEnums();
	}, [fetchEnums]);

	// Load enums on mount
	useEffect(() => {
		fetchEnums();
	}, [fetchEnums]);

	return {
		categories,
		units,
		isLoading,
		error,
		refetch,
	};
};
