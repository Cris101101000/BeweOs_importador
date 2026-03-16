export interface LogoManagerProps {
	logo: string | null;
	isUploading?: boolean;
	onLogoUpload: (files: File[]) => void;
	onLogoRemove: () => void;
}
