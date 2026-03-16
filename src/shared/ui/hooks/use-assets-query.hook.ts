import type { IAssetResponse } from "@shared/domain/interfaces/asset-response.interface";
import { AssetsQueryAdapter } from "@shared/infrastructure/adapters/assets-query.adapter";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Options for the assets query hook
 */
interface UseAssetsQueryOptions {
	resourceType: string; // e.g., 'product', 'service', 'client', 'user'
	entityId: string;
	autoLoad?: boolean; // Auto-load on mount (default: true)
	onSuccess?: (assets: IAssetResponse[]) => void;
	onError?: (error: Error) => void;
}

/**
 * Hook return type
 */
interface UseAssetsQueryReturn {
	assets: IAssetResponse[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	deleteAsset: (assetId: string) => Promise<void>;
}

/**
 * React hook for querying assets by entity
 * Generic hook that works for any entity type (products, services, clients, etc.)
 *
 * @example
 * // For products
 * const { assets, isLoading } = useAssetsQuery({
 *   resourceType: 'product',
 *   entityId: productId
 * });
 *
 * // For clients
 * const { assets, isLoading } = useAssetsQuery({
 *   resourceType: 'client',
 *   entityId: clientId
 * });
 */
export const useAssetsQuery = (
	options: UseAssetsQueryOptions
): UseAssetsQueryReturn => {
	const {
		resourceType,
		entityId,
		autoLoad = true,
		onSuccess,
		onError,
	} = options;

	const [assets, setAssets] = useState<IAssetResponse[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const adapter = useMemo(() => new AssetsQueryAdapter(), []);

	const fetchAssets = useCallback(async () => {
		if (!resourceType || !entityId) {
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const fetchedAssets = await adapter.getAssetsByEntity(
				resourceType,
				entityId
			);

			setAssets(fetchedAssets);

			if (onSuccess) {
				onSuccess(fetchedAssets);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error loading assets";
			setError(errorMessage);

			if (onError) {
				onError(err instanceof Error ? err : new Error(errorMessage));
			}
		} finally {
			setIsLoading(false);
		}
	}, [resourceType, entityId, adapter, onSuccess, onError]);

	const deleteAsset = useCallback(
		async (assetId: string) => {
			try {
				setIsLoading(true);
				setError(null);

				await adapter.deleteAsset(assetId);

				// Remove from local state
				setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error deleting asset";
				setError(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[adapter]
	);

	// Auto-load on mount if enabled
	useEffect(() => {
		if (autoLoad) {
			fetchAssets();
		}
	}, [autoLoad, fetchAssets]);

	return {
		assets,
		isLoading,
		error,
		refetch: fetchAssets,
		deleteAsset,
	};
};
