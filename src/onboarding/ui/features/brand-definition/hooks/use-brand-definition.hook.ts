import { useCallback, useEffect, useState } from "react";
import { useBrandDefinitionStore } from "src/onboarding/ui/_shared/store";
import { useBrandGuideFetch } from "./use-brand-guide-fetch.hook";
import { useBrandSave } from "./use-brand-save.hook";
import { useLogo } from "./use-logo.hook";

export const useBrandDefinition = () => {
	const brandDefinitionData = useBrandDefinitionStore((state) => state.data);
	const setBrandDefinitionData = useBrandDefinitionStore(
		(state) => state.setData
	);

	const [businessName, setBusinessName] = useState(
		brandDefinitionData.businessName || ""
	);
	const [description, setDescription] = useState(
		brandDefinitionData.businessDescription || ""
	);
	const [primaryColor, setPrimaryColor] = useState(
		brandDefinitionData.primaryColor || "#4F46E5"
	);
	const [secondaryColor, setSecondaryColor] = useState(
		brandDefinitionData.secondaryColor || "#EC4899"
	);

	const { initialValues, isFetching, fetchedData } = useBrandGuideFetch();

	const { logoFile, logoUrl, handleLogoUpload, handleLogoRemove, setLogoUrl } =
		useLogo(brandDefinitionData.logoFile, brandDefinitionData.logoUrl);

	useEffect(() => {
		if (fetchedData) {
			if (fetchedData.businessName) {
				setBusinessName(fetchedData.businessName);
			}
			setDescription(fetchedData.description);
			setPrimaryColor(fetchedData.primaryColor);
			setSecondaryColor(fetchedData.secondaryColor);
			setLogoUrl(fetchedData.logoUrl);
		}
	}, [fetchedData, setLogoUrl]);

	const persistData = useCallback(() => {
		setBrandDefinitionData({
			businessName,
			businessDescription: description,
			primaryColor,
			secondaryColor,
			logoUrl,
			logoFile,
		});
	}, [
		setBrandDefinitionData,
		businessName,
		description,
		primaryColor,
		secondaryColor,
		logoUrl,
		logoFile,
	]);

	const { isSaving, handleSave } = useBrandSave({
		businessName,
		description,
		primaryColor,
		secondaryColor,
		logoFile,
		initialValues,
		onSuccess: persistData,
	});

	const isFormValid =
		businessName.trim().length > 0 && description.trim().length >= 20;

	return {
		businessName,
		setBusinessName,
		description,
		setDescription,
		primaryColor,
		setPrimaryColor,
		secondaryColor,
		setSecondaryColor,
		logoUrl,
		isFetching,
		isSaving,
		isFormValid,
		handleLogoUpload,
		handleLogoRemove,
		handleSave,
		persistData,
	};
};
