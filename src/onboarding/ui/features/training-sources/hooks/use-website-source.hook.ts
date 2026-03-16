import { useCallback, useState } from "react";
import {
	normalizeWebsiteInput,
	buildPublicWebsiteUrl,
	isValidPublicWebsite,
} from "../utils";

export const useWebsiteSource = (initialUrl: string) => {
	const [websiteUrl, setWebsiteUrl] = useState(
		normalizeWebsiteInput(initialUrl)
	);

	const hasWebsiteInput = websiteUrl.trim().length > 0;
	const isWebsiteUrlValid = isValidPublicWebsite(websiteUrl);
	const websiteValidationMessage =
		hasWebsiteInput && !isWebsiteUrlValid
			? "Ingresa una URL válida con dominio público (ejemplo: empresa.com)"
			: undefined;
	const websiteUrlToPersist = isWebsiteUrlValid
		? buildPublicWebsiteUrl(websiteUrl)
		: null;

	const handleWebsiteChange = useCallback((value: string) => {
		setWebsiteUrl(normalizeWebsiteInput(value));
	}, []);

	const handleAddWebsite = useCallback(() => {
		if (!websiteUrlToPersist) {
			return;
		}
	}, [websiteUrlToPersist]);

	return {
		websiteUrl,
		isWebsiteUrlValid,
		websiteValidationMessage,
		websiteUrlToPersist,
		handleWebsiteChange,
		handleAddWebsite,
	};
};
