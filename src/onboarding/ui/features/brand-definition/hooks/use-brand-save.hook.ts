import { useAuraToast, useThemeContext } from "@beweco/aurora-ui";
import { type RefObject, useCallback, useState } from "react";
import {
	ExtractBrandGuide,
	PatchLogoFile,
	UpdateBrandGuide,
	UpdateBrandProfile,
} from "../DependencyInjection";
import type { InitialValues } from "./types";

interface BrandSaveParams {
	businessName: string;
	description: string;
	primaryColor: string;
	secondaryColor: string;
	logoFile: File | null;
	initialValues: RefObject<InitialValues>;
	onSuccess: () => void;
}

interface BrandSaveResult {
	isSaving: boolean;
	handleSave: () => Promise<boolean>;
}

export const useBrandSave = ({
	businessName,
	description,
	primaryColor,
	secondaryColor,
	logoFile,
	initialValues,
	onSuccess,
}: BrandSaveParams): BrandSaveResult => {
	const [isSaving, setIsSaving] = useState(false);
	const { showToast } = useAuraToast();
	const { setColor } = useThemeContext();

	const handleSave = useCallback(async (): Promise<boolean> => {
		setIsSaving(true);
		try {
			const onlyLogoChanged =
				logoFile !== null &&
				description === initialValues.current.description &&
				primaryColor === initialValues.current.primaryColor &&
				secondaryColor === initialValues.current.secondaryColor;

			const fieldsChanged =
				description !== initialValues.current.description ||
				primaryColor !== initialValues.current.primaryColor ||
				secondaryColor !== initialValues.current.secondaryColor;

			if (logoFile !== null) {
				await PatchLogoFile(logoFile);
			}

			if (!onlyLogoChanged && fieldsChanged) {
				await UpdateBrandGuide({
					smbAddedDescription: description,
					primaryColor,
					secondaryColor,
				});
			}

			const businessNameChanged =
				businessName !== initialValues.current.businessName;

			if (businessNameChanged) {
				await UpdateBrandProfile({ businessName });
			}

			const extractResult = await ExtractBrandGuide({
				generateContentFromBrandExtraction: true,
			});

			if (!extractResult.isSuccess) {
				showToast({
					color: "danger",
					title: "Error al guardar la marca",
					description: "Intenta nuevamente",
				});
				return false;
			}

			setColor(primaryColor);

			onSuccess();
			return true;
		} catch {
			showToast({
				color: "danger",
				title: "Error al guardar la marca",
				description: "Intenta nuevamente",
			});
			return false;
		} finally {
			setIsSaving(false);
		}
	}, [
		businessName,
		logoFile,
		description,
		primaryColor,
		secondaryColor,
		initialValues,
		onSuccess,
		showToast,
		setColor,
	]);

	return { isSaving, handleSave };
};
