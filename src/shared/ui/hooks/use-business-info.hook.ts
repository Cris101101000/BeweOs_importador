import { GetBusinessInformationUseCase } from "@settings/bussinesConfig/application/get-business-information.usecase";
import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import { BusinessInformationAdapter } from "@settings/bussinesConfig/infrastructure/adapters/business-information.adapter";
import { useEffect, useState } from "react";

/**
 * Hook to get business information globally
 * Fetches and caches business information for the current company
 *
 * @returns Business information or null if not loaded yet
 */
export function useBusinessInfo() {
	const [businessInfo, setBusinessInfo] = useState<IBusinessInformation | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBusinessInfo = async () => {
			try {
				setIsLoading(true);
				const adapter = new BusinessInformationAdapter();
				const useCase = new GetBusinessInformationUseCase(adapter);
				const data = await useCase.execute();

				console.log("📊 Business Info Loaded:", {
					basicInfo: data.basicInfo,
					contactInfo: data.contactInfo,
					brandConfig: data.brandConfig,
				});

				setBusinessInfo(data);
				setError(null);
			} catch (err) {
				console.error("❌ Error loading business info:", err);
				setError(
					err instanceof Error
						? err.message
						: "Failed to load business information"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBusinessInfo();
	}, []);

	return { businessInfo, isLoading, error };
}
