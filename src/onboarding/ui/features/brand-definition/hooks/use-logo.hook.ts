import { useEffect, useState } from "react";

interface LogoResult {
	logoFile: File | null;
	logoUrl: string | null;
	handleLogoUpload: (files: File[]) => void;
	handleLogoRemove: () => void;
	setLogoUrl: (url: string | null) => void;
}

export const useLogo = (
	initialLogoFile: File | null,
	initialLogoUrl: string | null
): LogoResult => {
	const [logoFile, setLogoFile] = useState<File | null>(initialLogoFile);
	const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);

	useEffect(() => {
		return () => {
			if (logoUrl?.startsWith("blob:")) {
				URL.revokeObjectURL(logoUrl);
			}
		};
	}, [logoUrl]);

	const handleLogoUpload = (files: File[]) => {
		if (!files.length) return;

		if (logoUrl?.startsWith("blob:")) {
			URL.revokeObjectURL(logoUrl);
		}

		const file = files[0];
		setLogoFile(file);
		setLogoUrl(URL.createObjectURL(file));
	};

	const handleLogoRemove = () => {
		if (logoUrl?.startsWith("blob:")) {
			URL.revokeObjectURL(logoUrl);
		}
		setLogoFile(null);
		setLogoUrl(null);
	};

	return { logoFile, logoUrl, handleLogoUpload, handleLogoRemove, setLogoUrl };
};
