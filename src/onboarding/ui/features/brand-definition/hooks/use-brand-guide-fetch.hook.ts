import { type RefObject, useEffect, useRef, useState } from "react";
import { GetBrandGuide, GetBusinessInformation } from "../DependencyInjection";
import type { InitialValues } from "./types";

const DEFAULT_PRIMARY = "#4F46E5";
const DEFAULT_SECONDARY = "#EC4899";

interface FetchedBrandData {
	businessName: string;
	description: string;
	primaryColor: string;
	secondaryColor: string;
	logoUrl: string | null;
}

interface BrandGuideFetchResult {
	initialValues: RefObject<InitialValues>;
	isFetching: boolean;
	fetchedData: FetchedBrandData | null;
}

export const useBrandGuideFetch = (): BrandGuideFetchResult => {
	const [isFetching, setIsFetching] = useState(true);
	const [fetchedData, setFetchedData] = useState<FetchedBrandData | null>(null);

	const initialValues = useRef<InitialValues>({
		businessName: "",
		description: "",
		primaryColor: DEFAULT_PRIMARY,
		secondaryColor: DEFAULT_SECONDARY,
		logoUrl: null,
	});

	useEffect(() => {
		let cancelled = false;

		const loadBrandGuide = async () => {
			setIsFetching(true);
			try {
				const [brandGuideResult, businessInfoResult] = await Promise.allSettled(
					[GetBrandGuide(), GetBusinessInformation()]
				);

				if (cancelled) return;

				const brandGuide =
					brandGuideResult.status === "fulfilled"
						? brandGuideResult.value
						: null;
				const businessInfo =
					businessInfoResult.status === "fulfilled"
						? businessInfoResult.value
						: null;

				const name = businessInfo?.basicInfo?.name || "";
				const desc = brandGuide?.smbAddedDescription || "";
				const primary = brandGuide?.primaryColor || DEFAULT_PRIMARY;
				const secondary = brandGuide?.secondaryColor || DEFAULT_SECONDARY;
				const logo = brandGuide?.logoUrl || null;

				initialValues.current = {
					businessName: name,
					description: desc,
					primaryColor: primary,
					secondaryColor: secondary,
					logoUrl: logo,
				};

				setFetchedData({
					businessName: name,
					description: desc,
					primaryColor: primary,
					secondaryColor: secondary,
					logoUrl: logo,
				});
			} catch {
				// Mantener defaults si falla el GET
			} finally {
				if (!cancelled) setIsFetching(false);
			}
		};

		loadBrandGuide();

		return () => {
			cancelled = true;
		};
	}, []);

	return { initialValues, isFetching, fetchedData };
};
